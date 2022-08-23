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
    const logits = tf.tidy(() => {
      let img = tf.node.decodeImage(image);
      img = tf.image.resizeBilinear(img, [224,224]);

      const offset = tf.scalar(127.5);
      // Normalize the image from [0, 255] to [-1, 1]
      const normalized = img.sub(offset).div(offset);

      const batched = normalized.reshape([1, model.inputs[0].shape[1], model.inputs[0].shape[2], model.inputs[0].shape[3]]);

      return model.predict(batched);
    });
    const data = await logits.data();

    const results = [];
    for (let i = 0; i < data.length; i++) {
      results.push({ score: data[i], label: labels[i] });
    }
    return results;
}
