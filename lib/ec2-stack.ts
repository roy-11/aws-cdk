import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";

interface EC2StackProps extends cdk.StackProps {
  ec2InstanceClass: string;
  ec2InstanceSize: string;
  cpuType: string;
}

export class EC2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EC2StackProps) {
    super(scope, id, props);

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
      cpuType: props.cpuType as ec2.AmazonLinuxCpuType,
    });

    // 指定した内容でEC2インスタンスを作成
    new ec2.Instance(this, "Instance", {
      vpc,
      instanceType: ec2.InstanceType.of(
        props.ec2InstanceClass as ec2.InstanceClass,
        props.ec2InstanceSize as ec2.InstanceSize,
      ),
      machineImage: ami,
      securityGroup: securityGroup,
      keyPair: key,
    });
  }
}
