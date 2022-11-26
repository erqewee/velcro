import { Manager } from "../Manager.js";

import { ChannelManager as BaseChannelManager } from "../Channel/ChannelManager.js";
const ChannelManager = new BaseChannelManager();

export class MessageManager {
  constructor() {
    this.get = async function (channelID, messageID) {
      if (typeof channelID !== "string") throw new TypeError("ChannelID must be a STRING!");
      if (typeof messageID !== "string") throw new TypeError("MessageID must be a STRING!");

      const message = await Manager.GET(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/channels/${channelID}/messages/${messageID}`);

      return message;
    };

    this.edit = async function (channelID, messageID, options = {
      content: null,
      embeds: [],
      flags: 0,
      allowedMentions: {},
      components: [],
      files: [],
      payloadJson: null,
      attachments: []
    }) {
      if (typeof channelID !== "string") throw new TypeError("ChannelID must be a STRING!");
      if (typeof messageID !== "string") throw new TypeError("MessageID must be a STRING!");

      const message = await Manager.PATCH(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/channels/${channelID}/messages/${messageID}`, {
        content: options?.content,
        embeds: options?.embeds,
        flags: options?.flags,
        allowed_mentions: options?.allowedMentions,
        components: options?.attachments,
        files: options?.files,
        payload_json: options?.payloadJson,
        attachments: options?.attachments
      });

      return message;
    };

    this.create = async function (channelID, options = {
      content: null,
      embeds: [],
      flags: 0,
      allowedMentions: {},
      components: [],
      files: [],
      payloadJson: null,
      attachments: [],
      nonce: null,
      tts: false,
      messageReference: {},
      stickerIds: []
    }) {
      if (typeof channelID !== "string") throw new TypeError("ChannelID must be a STRING!");

      const message = await Manager.POST(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/channels/${channelID}/messages`, {
        content: options?.content,
        embeds: options?.embeds,
        flags: options?.flags,
        allowed_mentions: options?.allowedMentions,
        components: options?.attachments,
        files: options?.files,
        payload_json: options?.payloadJson,
        attachments: options?.attachments,
        nonce: options?.nonce,
        tts: options?.tts,
        message_reference: options?.messageReference,
        sticker_ids: options?.stickerIds
      });

      return message;
    };

    this.map = async function (channelID, options = {
      limit: 1,
      around: null,
      before: null,
      after: null
    }) {
      if (typeof channelID !== "string") throw new TypeError("ChannelID must be a STRING!");

      const message = await Manager.GET(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/channels/${channelID}/messages`, {
        around: options?.around,
        before: options?.before,
        after: options?.after,
        limit: options?.limit
      });

      return message;
    };

    this.pin = async function(message_) {
      const channel = await ChannelManager.get(message_.channel.id);
      const message = await this.get(channel.id, message_.id);

      const pin = await Manager.PUT(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/channels/${channel.id}/pins/${message.id}`);

      return pin;
    };

    this.unpin = async function(message_) {
      if (typeof message !== "string") throw new TypeError("Message must be a STRING!");

      const channel = await ChannelManager.get(message_.channel.id);
      const message = await this.get(channel.id, message_.id);

      const unpin = await Manager.DELETE(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/channels/${channel.id}/pins/${message.id}`);

      return unpin;
    };
  };
};