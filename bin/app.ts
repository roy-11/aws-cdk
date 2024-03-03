#!/usr/bin/env node
// import "source-map-support/register";
import { App, StackProps } from "aws-cdk-lib";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { EC2Stack } from "../lib/ec2-stack";
import {
  SSMParameterStoreStack,
  cdkGroupName,
  defaultEnv,
  envList,
} from "../lib/ssm-parameter-store-stack";

const app = new App();

const env: StackProps["env"] = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const ssmp = new SSMParameterStoreStack(app, "SSMParameterStoreStack", { env });
const selectedEnv: string = app.node.tryGetContext("env") ?? defaultEnv;
if (!envList.includes(selectedEnv)) throw new Error("Invalid env");

new EC2Stack(app, "EC2Stack", {
  env,
  ec2InstanceClass: ssm.StringParameter.valueFromLookup(
    ssmp,
    `/${cdkGroupName}/${selectedEnv}/ec2InstanceClass`,
  ),
  ec2InstanceSize: ssm.StringParameter.valueFromLookup(
    ssmp,
    `/${cdkGroupName}/${selectedEnv}/ec2InstanceSize`,
  ),
  cpuType: ssm.StringParameter.valueFromLookup(
    ssmp,
    `/${cdkGroupName}/${selectedEnv}/cpuType`,
  ),
});
