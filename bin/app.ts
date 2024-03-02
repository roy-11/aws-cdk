#!/usr/bin/env node
// import "source-map-support/register";
import { App, StackProps } from "aws-cdk-lib";
import { EC2Stack } from "../lib/ec2-stack";

const app = new App();

const env: StackProps["env"] = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

new EC2Stack(app, "EC2Stack", {
  env,
});
