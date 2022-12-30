import { autorun, makeAutoObservable } from "mobx";
import { VideoInfoT } from '../types';
class VideoStore {
    videoList: VideoInfoT[] = [];
    currentVideoID: string = '';
    constructor() {
        makeAutoObservable(this);

        autorun(() => {
            console.log('changed', this.currentVideoID)
        })
    }
}

export const videoStore = new VideoStore();