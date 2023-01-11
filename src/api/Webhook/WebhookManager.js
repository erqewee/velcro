import { API } from "../API.js";
const api = new API();

import { ChannelManager as BaseChannelManager } from "../Channel/ChannelManager.js";
const ChannelManager = new BaseChannelManager();

const { PATCH, POST, PUT, GET, DELETE } = api;

import Discord from "discord.js";
const { Webhook, GuildChannel, Message } = Discord;

export class WebhookManager {
  constructor() { };

  /**
   * Retrieves the information of the webhook you specify.
   * @param {Webhook} webhook 
   */
  async get(webhook) {
    const webhookChecker = new api.checker.BaseChecker(webhook);
    webhookChecker.createError(!webhookChecker.isObject, "webhook", { expected: "Object", received: webhookChecker }).throw();

    const fetched = await GET(`${api.config.BASE_URL}/webhooks/${webhook.id}`);

    return fetched;
  };

  /**
   * Creates a new webhook in the channel you specify.
   * @param {GuildChannel} channel 
   * @param {object} options 
   */
  async create(channel, options = {
    name: null,
    avatar: null
  }) {
    const channelChecker = new api.checker.BaseChecker(channel);
    channelChecker.createError(!channelChecker.isObject, "channel", { expected: "Object", received: channelChecker }).throw();

    const fetchedChannel = await ChannelManager.get(channel.id);
    const webhook = await POST(`${api.config.BASE_URL}/${api.config.VERSION}/channels/${fetchedChannel.id}/webhooks`, {
      json: {
        name: options?.name,
        avatar: options?.avatar
      }
    });

    return webhook;
  };

  /**
   * Creates a new message in the webhook you specify.
   * @param {Webhook} webhook
   * @param {object} options 
   * @returns {Message}
   */
  async message(webhook, options = {
    content: null,
    embeds: [],
    flags: 0,
    allowedMentions: {},
    components: [],
    files: [],
    payloadJSON: null,
    attachments: [],
    nonce: null,
    tts: false,
    messageReference: {},
    stickerIds: []
  }) {
    const webhookChecker = new api.checker.BaseChecker(webhook);
    webhookChecker.createError(!webhookChecker.isObject, "webhook", { expected: "Object", received: webhookChecker }).throw();

    const fetched = await this.get(webhook.id);

    const message = await POST(`${api.config.BASE_URL}/webhooks/${fetched.id}/${fetched.token}`, {
      json: {
        content: options?.content,
        embeds: options?.embeds,
        flags: options?.flags,
        allowed_mentions: options?.allowedMentions,
        components: options?.attachments,
        files: options?.files,
        payload_json: options?.payloadJSON,
        attachments: options?.attachments,
        nonce: options?.nonce,
        tts: options?.tts,
        message_reference: options?.messageReference,
        sticker_ids: options?.stickerIds
      }
    });

    return message;
  };

  /**
   * Deletes the webhook you specified.
   * @param {Webhook} webhook 
   * @returns {Promise<number>}
   */
  async delete(webhook) {
    const webhookChecker = new api.checker.BaseChecker(webhook);
    webhookChecker.createError(!webhookChecker.isObject, "webhook", { expected: "Object", received: webhookChecker }).throw();

    const fetched = await this.get(webhook.id);

    DELETE(`${api.config.BASE_URL}/webhooks/${fetched.id}/${fetched.token}`);

    return 0;
  };
};