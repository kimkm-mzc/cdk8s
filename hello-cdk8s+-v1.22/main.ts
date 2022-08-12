import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';
import * as kplus from 'cdk8s-plus-22';

// imported constructs
import { KubeService, IntOrString } from './imports/k8s';

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    const label = { app: 'hello-k8s' };

    // notice that there is no assignment necessary when creating resources.
    // simply instantiating the resource is enough because it adds it to the construct tree via
    // the first argument, which is always the parent construct.
    // its a little confusing at first glance, but this is an inherent aspect of the constructs
    // programming model, and you will encounter it many times.
    // you can still perform an assignment of course, if you need to access
    // attributes of the resource in other parts of the code.

    new KubeService(this, 'service', {
      spec: {
        type: 'LoadBalancer',
        ports: [ { port: 80, targetPort: IntOrString.fromNumber(8080) } ],
        selector: label
      }
    });

    new kplus.Deployment(chart, 'Deployment', {
      containers: [{ image:'nginx'}],
    }});

const app = new App();
new MyChart(app, 'hello');
app.synth();