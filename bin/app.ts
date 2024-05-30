#!/usr/bin/env node
// import "source-map-support/register";
import { App, StackProps } from "aws-cdk-lib";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { EC2Stack } from "../lib/ec2-stack";
import { SSMParameterStoreStack } from "../lib/ssm-parameter-store-stack";

const app = new App();

const env: StackProps["env"] = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const defaultEnv = "dev";
const selectedEnv: string = app.node.tryGetContext("env") ?? defaultEnv;
const envList = [defaultEnv];
if (!envList.includes(selectedEnv)) throw new Error("Invalid env");

new SSMParameterStoreStack(app, "SSMParameterStoreStack", {
  env,
  envName: selectedEnv,
});

new EC2Stack(app, "EC2Stack", { env, envName: selectedEnv });
