import { StackProps } from "aws-cdk-lib";

declare module "aws-cdk-lib" {
  export interface StackProps {
    envName: string;
  }
}
