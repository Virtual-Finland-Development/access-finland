import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';
import setup, { nameResource } from '../utils/setup';

const { tags } = setup;

export function createECSCluster() {
  // ECS cluster
  return new aws.ecs.Cluster(nameResource('ecs-cluster'), {
    tags,
  });
}

export function createECSAutoScaling(
  cluster: aws.ecs.Cluster,
  fargateService: awsx.ecs.FargateService
) {
  // ECS Auto-scaling
  const ecsTarget = new aws.appautoscaling.Target(
    nameResource('ecs-autoscaling-target'),
    {
      maxCapacity: 4,
      minCapacity: 1,
      resourceId: pulumi.interpolate`service/${cluster.name}/${fargateService.service.name}`,
      scalableDimension: 'ecs:service:DesiredCount',
      serviceNamespace: 'ecs',
    }
  );
  new aws.appautoscaling.Policy(nameResource('ecs-scaling-policy'), {
    policyType: 'TargetTrackingScaling',
    resourceId: ecsTarget.resourceId,
    scalableDimension: ecsTarget.scalableDimension,
    serviceNamespace: ecsTarget.serviceNamespace,
    targetTrackingScalingPolicyConfiguration: {
      predefinedMetricSpecification: {
        predefinedMetricType: 'ECSServiceAverageCPUUtilization',
      },
      scaleInCooldown: 60,
      scaleOutCooldown: 60,
      targetValue: 50,
    },
  });
}
