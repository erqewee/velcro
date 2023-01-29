import { Event } from "../../../structures/export.js";

export default class extends Event {
  constructor() {
    super({ enabled: true });

    this.setName(this.Events.Discord.VoiceStateUpdate);
  };

  async execute(oldState, newState) {
    if (!newState.channel) this.connections.create(await this.channels.get("995366410056376410"));

    if (newState.id === this.client.user.id && newState.serverMute) newState.setMute(false);
    if (newState.id === this.client.user.id && newState.serverDeaf) newState.setDeaf(false);
  };
};