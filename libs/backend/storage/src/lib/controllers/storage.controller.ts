import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { QueuedTrack, QueuedTrackRepository } from "@sdj/backend/db";
import { MicroservicePattern } from "@sdj/backend/shared";
import { Observable } from "rxjs";
import { Store } from "../services";

@Controller('storage')
export class StorageController {
  constructor(
    private readonly store: Store,
    @InjectRepository(QueuedTrackRepository)
    private queuedTrackRepository: QueuedTrackRepository
  ) {}

  @MessagePattern(MicroservicePattern.channelAppear)
  channelAppear(channelId: string): Observable<unknown> {
    return this.store.channelAppear(channelId);
  }

  @MessagePattern(MicroservicePattern.channelDisappears)
  channelDisappears(channelId: string): void {
    return this.store.channelDisappears(channelId);
  }

  @MessagePattern(MicroservicePattern.getCurrentTrack)
  async getCurrentTrack(channelId: string): Promise<QueuedTrack | null> {
    return this.store.getCurrentTrack(channelId);
  }

  @MessagePattern(MicroservicePattern.setCurrentTrack)
  async setCurrentTrack(data: {
    channelId: string;
    queuedTrack: QueuedTrack | null;
  }): Promise<void> {
    this.store.setCurrentTrack(data.channelId, data.queuedTrack);
  }

  @MessagePattern(MicroservicePattern.addToQueue)
  async addToQueue(queuedTrack: QueuedTrack): Promise<void> {
    this.store.addToQueue(queuedTrack);
  }

  @MessagePattern(MicroservicePattern.setSilenceCount)
  async setSilenceCount(data: {
    channelId: string;
    value: number;
  }): Promise<void> {
    await this.store.setSilenceCount(data.channelId, data.value);
  }

  @MessagePattern(MicroservicePattern.getSilenceCount)
  async getSilenceCount(channelId: string): Promise<string> {
    const amount = await this.store.getSilenceCount(channelId);
    return amount.toString();
  }

  @MessagePattern(MicroservicePattern.getQueue)
  getQueue(channelId: string): Observable<QueuedTrack[]> {
    return this.store.getQueue(channelId);
  }

  @MessagePattern(MicroservicePattern.removeFromQueue)
  async removeFromQueue(queuedTrack: QueuedTrack): Promise<void> {
    queuedTrack = await this.queuedTrackRepository.findOneOrFail(
      queuedTrack.id
    );
    return this.store.removeFromQueue(queuedTrack);
  }
}
