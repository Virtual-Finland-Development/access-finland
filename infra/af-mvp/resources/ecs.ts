import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';
import Setup from '../utils/Setup';

export function createECSCluster(setup: Setup) {
  // ECS cluster
  return new aws.ecs.Cluster(setup.nameResource('ecs-cluster'), {
    tags: setup.tags,
  });
}

export function createECSAutoScaling(
  setup: Setup,
  cluster: aws.ecs.Cluster,
  fargateService: awsx.ecs.FargateService
) {
  // ECS Auto-scaling
  const ecsTarget = new aws.appautoscaling.Target(
    setup.nameResource('ecs-autoscaling-target'),
    {
      maxCapacity: 4,
      minCapacity: 1,
      resourceId: pulumi.interpolate`service/${cluster.name}/${fargateService.service.name}`,
      scalableDimension: 'ecs:service:DesiredCount',
      serviceNamespace: 'ecs',
    }
  );
  new aws.appautoscaling.Policy(setup.nameResource('ecs-scaling-policy'), {
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
