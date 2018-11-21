import { lerpLookup, lerpSearch } from './lerp';

type TimeSeries = [number[], number[]];

const handler = {
  get(obj: TimeSeries, key: string) {
    return lerpLookup(obj[1], lerpSearch(obj[0], parseFloat(key)));
  }
};

export function makeTimeSeries(times: number[], values: number[]): number[] {
  return new Proxy([times, values], handler) as any;
}
