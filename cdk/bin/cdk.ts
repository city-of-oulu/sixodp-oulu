#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {VpcStack} from "../lib/vpc-stack";
import {ParameterStack} from "../lib/parameter-stack";
import {DatabaseStack} from "../lib/database-stack";
import {KmsKeyStack} from "../lib/kms-key-stack";
import {LoadBalancerStack} from "../lib/load-balancer-stack";
import {WebServerStack} from "../lib/web-server-stack";
import {BackgroundServerStack} from "../lib/background-server-stack";
import {FileSystemStack} from "../lib/file-system-stack";
import {SesStack} from "../lib/ses-stack";

const app = new cdk.App();

const stackProps = {
    account: '146886872312',
    region: 'eu-west-1',
}

const env = {
    environment: 'oulu',
    domain: 'data.ouka.fi',
    fqdn: 'data.ouka.fi'
}

const vpcStack = new VpcStack(app, 'vpcStack', {
    env: {
        account: stackProps.account,
        region: stackProps.region
    }
})

const parameterStack = new ParameterStack(app, 'parameterStack', {
    env: {
        account: stackProps.account,
        region: stackProps.region
    }
})

const kmsKeyStack = new KmsKeyStack(app, 'kmsKeyStack', {
    env: {
        account: stackProps.account,
        region: stackProps.region
    }
})

const databaseStack = new DatabaseStack(app, 'databaseStack', {
    env: {
        account: stackProps.account,
        region: stackProps.region
    },
    ckanDatabaseSnapshotParameterName: parameterStack.ckanDatabaseSnapshotParameterName,
    wpDatabaseSnapshotParameterName: parameterStack.wpDatabaseSnapshotParameterName,
    environment: env.environment,
    fqdn: env.fqdn,
    domain: env.domain,
    vpc: vpcStack.vpc,
})



const backgroundServerStack = new BackgroundServerStack(app, 'backgroundServerStack', {
    env: {
        account: stackProps.account,
        region: stackProps.region
    },
    vpc: vpcStack.vpc,
    environment: env.environment,
    fqdn: env.fqdn,
    secretBucketName: 'sixodp-oulu-secrets',
    domain: env.domain,
    ckanDatabase: databaseStack.ckanDatabase,
    wpDatabase: databaseStack.wpDatabase,
    ckanDatabaseCredentials: databaseStack.ckanDatabaseCredentials,
    wpDatabaseCredentials: databaseStack.wpDatabaseCredentials,
})

const fileSystemStack = new FileSystemStack(app, 'fileSystemStack', {
    env: {
        account: stackProps.account,
        region: stackProps.region
    },
    vpc: vpcStack.vpc,
    environment: env.environment,
    fqdn: env.fqdn,
    domain: env.domain
})


const webServerStack = new WebServerStack(app, 'webServerStack', {
    env: {
        account: stackProps.account,
        region: stackProps.region
    },
    vpc: vpcStack.vpc,
    environment: env.environment,
    fqdn: env.fqdn,
    secretBucketName: 'sixodp-oulu-secrets',
    domain: env.domain,
    ckanDatabase: databaseStack.ckanDatabase,
    wpDatabase: databaseStack.wpDatabase,
    ckanDatabaseCredentials: databaseStack.ckanDatabaseCredentials,
    wpDatabaseCredentials: databaseStack.wpDatabaseCredentials,
    minWebServerCapacity: 1,
    maxWebServerCapacity: 1,
    backgroundServer: backgroundServerStack.backgroundServer,
    fileSystem: fileSystemStack.fileSystem
})

const loadBalancerStack = new LoadBalancerStack(app, 'loadBalancerStack', {
    env: {
        account: stackProps.account,
        region: stackProps.region
    },
    environment: env.environment,
    fqdn: env.fqdn,
    domain: env.domain,
    vpc: vpcStack.vpc,
    webServerAsg: webServerStack.webServerAsg,
    pgAdminEnabled: true,
    numberOfAllowedIpsInPgAdmin: 1,
    pgAdminAllowedIpPrefix: parameterStack.pgAdminAllowedPrefix
})

const sesStack = new SesStack(app, 'sesStack', {
    env: {
        account: stackProps.account,
        region: stackProps.region
    },
    environment: env.environment,
    fqdn: env.fqdn,
    domain: env.domain,
    teamsPathParameterName: parameterStack.teamsWorkflowPathParameterName,
    teamsHostParameterName: parameterStack.teamsHostnameParameterName
})


