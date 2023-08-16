import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';
import setup, { nameResource } from '../utils/setup';

const {
  tags,
  customHeaderValue
} = setup;

export function createLoadBalancer() {

    const loadBalancer = new awsx.lb.ApplicationLoadBalancer(nameResource('alb'), {
        tags,
        defaultTargetGroup: {
          deregistrationDelay: 0,
          port: 3000,
        },
        listener: {
          port: 80,
          protocol: 'HTTP',
          tags,
          defaultActions: [
            {
              type: 'fixed-response',
              fixedResponse: {
                contentType: 'text/plain',
                messageBody: 'Access denied',
                statusCode: '403',
              },
            },
          ],
        },
      });
      
      new aws.lb.ListenerRule(
        nameResource('alb-listener-rule'),
        {
          listenerArn: loadBalancer.listeners.apply(
            listeners =>
              pulumi.interpolate`${
                listeners?.find(l => l.port && l.port.apply(p => p === 80))?.arn || ''
              }`
          ),
          actions: [
            {
              type: 'forward',
              targetGroupArn: loadBalancer.defaultTargetGroup.arn,
            },
          ],
          conditions: [
            {
              httpHeader: {
                httpHeaderName: 'X-Custom-Header',
                values: [customHeaderValue],
              },
            },
          ],
        }
      );

    return loadBalancer;
}