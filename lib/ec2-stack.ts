import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { getSSMParameter } from "./ssm-parameter-store-stack";

export class EC2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const envName = props.envName;
    const ec2InstanceClass = getSSMParameter(this, envName, "ec2InstanceClass");
    const ec2InstanceSize = getSSMParameter(this, envName, "ec2InstanceSize");
    const cpuType = getSSMParameter(this, envName, "cpuType");
    const ebsVolumeGiB = Number(getSSMParameter(this, envName, "ebsVolumeGiB"));

    // デフォルトのvpcを取得
    const vpc = ec2.Vpc.fromLookup(this, "VPC", {
      isDefault: true,
    });

    // キーペアを作成
    const key = new ec2.KeyPair(this, "KeyPair", {
      keyPairName: "ec2-keypair",
      type: ec2.KeyPairType.ED25519,
    });

    // セキュリティグループを作成
    const securityGroup = new ec2.SecurityGroup(this, "SecurityGroup", {
      securityGroupName: "ec2-sg",
      vpc,
      description: "Allow SSH (TCP port 22)",
      allowAllOutbound: true,
    });

    // SSH用にtcp/22ポートへのアクセスを許可
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      "Allow SSH Access",
    );

    // AMIを指定
    const ami = new ec2.AmazonLinuxImage({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023,
      cpuType: cpuType as ec2.AmazonLinuxCpuType,
    });

    // 指定した内容でEC2インスタンスを作成
    new ec2.Instance(this, "Instance", {
      vpc,
      instanceType: ec2.InstanceType.of(
        ec2InstanceClass as ec2.InstanceClass,
        ec2InstanceSize as ec2.InstanceSize,
      ),
      machineImage: ami,
      securityGroup: securityGroup,
      keyPair: key,
      blockDevices: [
        {
          deviceName: "/dev/xvda",
          volume: ec2.BlockDeviceVolume.ebs(ebsVolumeGiB),
        },
      ],
    });
  }
}
