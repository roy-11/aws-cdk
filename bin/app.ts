#!/usr/bin/env node
// import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { EC2Stack } from "../lib/ec2-stack";

const app = new cdk.App();

const env = {
  account: app.node.tryGetContext("account"),
  region: app.node.tryGetContext("region"),
};

new EC2Stack(app, "EC2Stack", {
  env,
});
