import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as ec2 from "aws-cdk-lib/aws-ec2";

type EnvironmentConfig = {
  ec2InstanceClass: string;
  ec2InstanceSize: string;
  cpuType: string;
  ebsVolumeGiB: string;
};

const baseConfig: EnvironmentConfig = {
  ec2InstanceClass: ec2.InstanceClass.T4G.toString(),
  ec2InstanceSize: ec2.InstanceSize.NANO.toString(),
  cpuType: ec2.AmazonLinuxCpuType.ARM_64.toString(),
  ebsVolumeGiB: "4",
};

const environmentConfigs: { [key: string]: EnvironmentConfig } = {
  dev: baseConfig,
  prod: {
    ...baseConfig,
  },
};

interface StackProps extends cdk.StackProps {
  envName: string;
}

export class SSMParameterStoreStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const envName = props.envName;
    const config = environmentConfigs[envName];

    // Seed用の値で各環境で使用するSSMパラメータを作成
    new ssm.StringParameter(
      this,
      getResourceName(envName, "ec2InstanceClass"),
      {
        parameterName: getParameterName(envName, "ec2InstanceClass"),
        stringValue: config.ec2InstanceClass,
      },
    );

    new ssm.StringParameter(this, getResourceName(envName, "ec2InstanceSize"), {
      parameterName: getParameterName(envName, "ec2InstanceSize"),
      stringValue: config.ec2InstanceSize,
    });

    new ssm.StringParameter(this, getResourceName(envName, "cpuType"), {
      parameterName: getParameterName(envName, "cpuType"),
      stringValue: config.cpuType,
    });

    new ssm.StringParameter(this, getResourceName(envName, "ebsVolumeGiB"), {
      parameterName: getParameterName(envName, "ebsVolumeGiB"),
      stringValue: config.ebsVolumeGiB,
    });
  }
}

const cdkGroupName = "cdk";

const getResourceName = (envName: string, target: keyof EnvironmentConfig) =>
  `${cdkGroupName}-${envName}-${target}`;

const getParameterName = (envName: string, target: keyof EnvironmentConfig) =>
  `/${cdkGroupName}/${envName}/${target}`;

export const getSSMParameter = (
  scope: cdk.Stack,
  envName: string,
  target: keyof EnvironmentConfig,
) => {
  return ssm.StringParameter.valueFromLookup(
    scope,
    getParameterName(envName, target),
  );
};
