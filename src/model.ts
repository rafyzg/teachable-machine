import * as tf from '@tensorflow/tfjs-node';
import get from 'axios';
import { Prediction } from './interfaces/prediction.interface';

async function loadModelMetadata(metadataUrl: string) {
  try {
    const metadata = await get(metadataUrl);
    return metadata.data.labels; 
  }
  catch (err) {
    console.log(`Failed loading metadata of model\n${err}`);
    process.exit();
  }
}

export async function loadModel(baseUrl: string) { 
  const modelUrl = baseUrl + 'model.json';
  const metadataUrl = baseUrl + 'metadata.json';
  const model = await tf.loadLayersModel(modelUrl);
  const labels = await loadModelMetadata(metadataUrl);
  return [model, labels];
}

export async function predict(model: any, labels: any, buffer: Uint8Array): Promise<Prediction[]> {
  const t = {} as any;
  t.decoded = tf.node.decodeImage(buffer);
  t.resized = tf.image.resizeBilinear(t.decoded, [224, 224]);
  t.expanded = tf.expandDims(t.resized, 0);

  t.results = await model.predict(t.expanded);
  const data = await t.results.data();

  for (const tensor of Object.keys(t)) tf.dispose(t[tensor]); // deallocate all tensors

  const results = [];
  for (let i = 0; i < data.length; i++) {
    results.push({ score: data[i], label: labels[i] });
  }

  return results;
}
