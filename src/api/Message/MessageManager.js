import { API } from "../API.js";
const api = new API();

const { PATCH, POST, PUT, GET, DELETE } = api;

import { ChannelManager as BaseChannelManager } from "../Channel/ChannelManager.js";
const ChannelManager = new BaseChannelManager();

export class MessageManager {
  constructor() { };

  async get(channelID, messageID) {
    if (!api.checker.check(channelID).isString()) api.checker.error("channelId", "InvalidType", { expected: "String", received: (typeof channelID) });
    if (!api.checker.check(messageID).isString()) api.checker.error("messageId", "InvalidType", { expected: "String", received: (typeof messageID) });

    const message = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/channels/${channelID}/messages/${messageID}`);

    return message;
  };

  async edit(channelID, messageID, options = {
    content: null,
    embeds: [],
    flags: 0,
    allowedMentions: {},
    components: [],
    files: [],
    payloadJson: null,
    attachments: []
  }) {
    if (!api.checker.check(channelID).isString()) api.checker.error("channelId", "InvalidType", { expected: "String", received: (typeof channelID) });
    if (!api.checker.check(messageID).isString()) api.checker.error("messageId", "InvalidType", { expected: "String", received: (typeof messageID) });

    const message = await PATCH(`${api.config.BASE_URL}/${api.config.VERSION}/channels/${channelID}/messages/${messageID}`, {
      json: {
        content: options?.content,
        embeds: options?.embeds,
        flags: options?.flags,
        allowed_mentions: options?.allowedMentions,
        components: options?.attachments,
        files: options?.files,
        payload_json: options?.payloadJson,
        attachments: options?.attachments
      }
    });

    return message;
  };

  async create(channelID, options = {
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
    stickers: []
  }) {
    if (!api.checker.check(channelID).isString()) api.checker.error("channelId", "InvalidType", { expected: "String", received: (typeof channelID) });

    const message = await POST(`${api.config.BASE_URL}/${api.config.VERSION}/channels/${channelID}/messages`, {
      json: {
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
        sticker_ids: options?.stickers
      }
    });

    return message;
  };

  async map(channelID, options = {
    limit: 1,
    around: null,
    before: null,
    after: null
  }) {
    if (!api.checker.check(channelID).isString()) api.checker.error("channelId", "InvalidType", { expected: "String", received: (typeof channelID) });

    const message = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/channels/${channelID}/messages`, {
      json: {
        around: options?.around,
        before: options?.before,
        after: options?.after,
        limit: options?.limit
      }
    });

    return message;
  };

  async pin(message) {
    if (!api.checker.check(message).isObject()) api.checker.error("message", "InvalidType", { expected: "Object", received: (typeof message) });

    const channel = await ChannelManager.get(message.channel.id);
    const fetched = await this.get(channel.id, message.id);

    const pin = await PUT(`${api.config.BASE_URL}/${api.config.VERSION}/channels/${channel.id}/pins/${fetched.id}`);

    return pin;
  };

  async unpin(message) {
    if (!api.checker.check(message).isObject()) api.checker.error("message", "InvalidType", { expected: "Object", received: (typeof message) });

    const channel = await ChannelManager.get(message.channel.id);
    const fetched = await this.get(channel.id, message.id);

    const unpin = DELETE(`${api.config.BASE_URL}/${api.config.VERSION}/channels/${channel.id}/pins/${fetched.id}`);

    return unpin;
  };
};