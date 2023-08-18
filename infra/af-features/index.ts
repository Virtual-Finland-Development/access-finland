import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import * as synced_folder from '@pulumi/synced-folder';
import * as fs from 'fs';

// Import the program's configuration settings.
const config = new pulumi.Config();
const path = config.get('artifactPath') || '../../apps/af-features/out';
const indexDocument = config.get('indexDocument') || 'index.html';
const errorDocument = config.get('errorDocument') || '404.html';

const env = pulumi.getStack();
const projectName = pulumi.getProject();

// Create an S3 bucket and configure it as a website.
const bucketName = `${projectName}-s3-bucket-${env}`;
const bucket = new aws.s3.Bucket(bucketName, {
  website: {
    indexDocument: indexDocument,
    errorDocument: errorDocument,
  },
  tags: {
    'vfd:project': pulumi.getProject(),
    'vfd:stack': pulumi.getStack(),
  },
});

// CloudFront origin access identity
const originAccessIdentity = new aws.cloudfront.OriginAccessIdentity(
  `${projectName}-oai`,
  {
    comment: `Origin access identity for ${projectName}`,
  }
);

// CloudFront function
const formatRequestCFFunction = new aws.cloudfront.Function(
  `${projectName}-cfF-${env}`,
  {
    runtime: 'cloudfront-js-1.0',
    comment: 'fn-format-request',
    publish: true,
    code: fs.readFileSync(
      './functions/fn-format-request/build/index.js',
      'utf8'
    ),
  }
);

// Create a CloudFront CDN to distribute and cache the website.
const cdn = new aws.cloudfront.Distribution(
  `${projectName}-cdn-${env}`,
  {
    enabled: true,
    defaultRootObject: 'index.html',
    httpVersion: 'http2',
    isIpv6Enabled: true,
    priceClass: 'PriceClass_All',
    waitForDeployment: true,
    retainOnDelete: false,
    origins: [
      {
        originId: bucket.arn,
        domainName: bucket.bucketRegionalDomainName,
        s3OriginConfig: {
          originAccessIdentity:
            originAccessIdentity.cloudfrontAccessIdentityPath,
        },
      },
    ],
    defaultCacheBehavior: {
      targetOriginId: bucket.arn,
      viewerProtocolPolicy: 'redirect-to-https',
      allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
      cachedMethods: ['GET', 'HEAD', 'OPTIONS'],
      defaultTtl: 600,
      maxTtl: 600,
      minTtl: 600,
      forwardedValues: {
        queryString: true,
        cookies: {
          forward: 'all',
        },
      },
      functionAssociations: [
        {
          eventType: 'viewer-request',
          functionArn: formatRequestCFFunction.arn,
        },
      ],
    },
    orderedCacheBehaviors: [
      {
        pathPattern: 'index.html',
        allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
        cachedMethods: ['GET', 'HEAD', 'OPTIONS'],
        targetOriginId: bucket.arn,
        forwardedValues: {
          queryString: true,
          cookies: {
            forward: 'all',
          },
        },
        defaultTtl: 10,
        minTtl: 0,
        maxTtl: 20,
        compress: true,
        viewerProtocolPolicy: 'redirect-to-https',
      },
    ],
    customErrorResponses: [
      {
        errorCode: 404,
        responseCode: 404,
        responsePagePath: `/${errorDocument}`,
      },
      {
        errorCode: 403,
        responseCode: 403,
        responsePagePath: `/${errorDocument}`,
      },
    ],
    restrictions: {
      geoRestriction: {
        restrictionType: 'none',
      },
    },
    viewerCertificate: {
      cloudfrontDefaultCertificate: true,
    },
    tags: {
      'vfd:project': pulumi.getProject(),
      'vfd:stack': pulumi.getStack(),
    },
  },
  {
    protect: false,
  }
);

// CloudFront IAM policy document for bucket policy
const policyForCloudfront = aws.iam.getPolicyDocumentOutput({
  version: '2008-10-17',
  policyId: 'PolicyForCloudFrontPrivateContent',
  statements: [
    {
      sid: 'AllowCloudFrontServicePrincipal',
      effect: 'Allow',
      principals: [
        {
          type: 'Service',
          identifiers: ['cloudfront.amazonaws.com'],
        },
      ],
      actions: ['s3:GetObject'],
      resources: [pulumi.interpolate`${bucket.arn}/*`],
      conditions: [
        {
          test: 'StringEquals',
          variable: 'AWS:SourceArn',
          values: [cdn.arn],
        },
      ],
    },
    {
      sid: 'AllowLegacyOAIReadOnly',
      effect: 'Allow',
      principals: [
        {
          type: 'AWS',
          identifiers: [originAccessIdentity.iamArn],
        },
      ],
      actions: ['s3:GetObject'],
      resources: [pulumi.interpolate`${bucket.arn}/*`],
    },
  ],
});

// S3 bucket policy
new aws.s3.BucketPolicy(`${bucketName}-bucket-policy-${env}`, {
  bucket: bucket.bucket,
  policy: policyForCloudfront.apply(policy => policy.json),
});

// Use a synced folder to manage the files of the website.
new synced_folder.S3BucketFolder(`${projectName}-s3-bucket-folder-${env}`, {
  path: path,
  bucketName: bucket.bucket,
  acl: 'public-read',
});

// Export the URLs and hostnames of the bucket and distribution.
export const cdnURL = pulumi.interpolate`https://${cdn.domainName}`;
