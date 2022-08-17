import { Injectable } from '@nestjs/common';
import { Prediction } from './interfaces/prediction.interface';
import { loadModel, predict} from './model';


@Injectable()
export class AppService {
  private model: any;
  private labels: any;
  constructor() {
    this.model = null;
    this.labels = null;
    (async() => {
      await this.initialize();
    })();
  }

  async initialize() {
    const [modeltf, labels] = await loadModel(process.env.MODEL_URL);
    this.model = modeltf;
    this.labels = labels;
    console.log(this.model.summary());
  }
  
  async getPrediction(image: any): Promise<Prediction[]> {
    const results = await predict(this.model, this.labels, image);
    return results;
  }
}
