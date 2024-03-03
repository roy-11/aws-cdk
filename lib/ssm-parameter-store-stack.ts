import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export const defaultEnv = "dev";
export const envList = [defaultEnv];
export const cdkGroupName = "cdk";

export class SSMParameterStoreStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    // Seed用の値で各環境で使用するSSMパラメータを作成
    for (const env of envList) {
      new ssm.StringParameter(this, `${cdkGroupName}-${env}-ec2InstanceClass`, {
        parameterName: `/${cdkGroupName}/${env}/ec2InstanceClass`,
        stringValue: ec2.InstanceClass.T4G,
      });

      new ssm.StringParameter(this, `${cdkGroupName}-${env}-ec2InstanceSize`, {
        parameterName: `/${cdkGroupName}/${env}/ec2InstanceSize`,
        stringValue: ec2.InstanceSize.NANO,
      });

      new ssm.StringParameter(this, `${cdkGroupName}-${env}-cpuType`, {
        parameterName: `/${cdkGroupName}/${env}/cpuType`,
        stringValue: ec2.AmazonLinuxCpuType.ARM_64,
      });
    }
  }
}
