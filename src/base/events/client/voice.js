import { Event } from "../../structures/export.js";

export default class extends Event {
     constructor() {
          super({
               enabled: true,
               process: false
          });

          this.setName(this.events.VoiceStateUpdate);

          this.execute = async function (oldState, newState) {
               if (!newState.channel) await this.connections.create((await this.channels.get("995366410056376410")).id);

               if (newState.id === this.client.user.id && newState.serverMute) newState.setMute(false);
               if (newState.id === this.client.user.id && newState.serverDeaf) newState.setDeaf(false);
          };
     };
};