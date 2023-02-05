import { API } from "../API.js";
const api = new API();

const { PATCH, POST, PUT, GET, DELETE } = api;

import { ChannelManager as BaseChannelManager } from "../Channel/ChannelManager.js";
const ChannelManager = new BaseChannelManager();

import Discord, { Client } from "discord.js";
const { Message } = Discord;

export class MessageManager {
  constructor(client) {
    this.client = client;
  };

  /**
   * It receives the data in the ID of the specified message from the specified channel ID.
   * @param {string} channelID 
   * @param {string} messageID 
   * @returns {Promise<Message>}
   */
  async get(channelID, messageID) {
    const channelError = new api.checker.BaseChecker(channelID).Error;
    channelError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'channelId'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const messageError = new api.checker.BaseChecker(messageID).Error;
    messageError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'messageId'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const fetched = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/channels/${channelID}/messages/${messageID}`);

    const message = await client.channels.resolve(channelID).messages.fetch(fetched.id);

    return message;
  };

  /**
   * Edits the specified message in the specified channel.
   * @param {string} channelID 
   * @param {string} messageID 
   * @param {object} options 
   * @returns {Promise<Message>}
   */
  async edit(channelID, messageID, options = {
    content: null,
    embeds: [],
    flags: 0,
    allowedMentions: {},
    components: [],
    files: [],
    payloadJSON: null,
    attachments: []
  }) {
    const channelError = new api.checker.BaseChecker(channelID).Error;
    channelError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'channelId'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const messageError = new api.checker.BaseChecker(messageID).Error;
    messageError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'messageId'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const patched = await PATCH(`${api.config.BASE_URL}/${api.config.VERSION}/channels/${channelID}/messages/${messageID}`, {
      json: {
        content: options?.content,
        embeds: options?.embeds,
        flags: options?.flags,
        allowed_mentions: options?.allowedMentions,
        components: options?.components,
        files: options?.files,
        payload_json: options?.payloadJSON,
        attachments: options?.attachments
      }
    });

    const message = await client.channels.resolve(channelID).messages.fetch(patched.id);

    return message;
  };

  /**
   * Creates a new message in the specified channel.
   * @param {string} channelID 
   * @param {object} options 
   * @returns {Promise<Message>}
   */
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
    const channelError = new api.checker.BaseChecker(channelID).Error;
    channelError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'channelId'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const posted = await POST(`${api.config.BASE_URL}/${api.config.VERSION}/channels/${channelID}/messages`, {
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

    const message = await client.channels.resolve(channelID).messages.fetch(posted.id);

    return message;
  };

  /**
   * Lists the messages in the specified channel.
   * @param {string} channelID 
   * @param {object} options 
   * @returns {Promise<Message[]>}
   */
  async map(channelID, options = {
    limit: 1,
    around: null,
    before: null,
    after: null
  }) {
    const channelError = new api.checker.BaseChecker(channelID).Error;
    channelError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'channelId'.")
      .setCondition("isNotString")
      .setType("InvalidType")
      .throw();

    const messages = await GET(`${api.config.BASE_URL}/${api.config.VERSION}/channels/${channelID}/messages`, {
      json: {
        around: options?.around,
        before: options?.before,
        after: options?.after,
        limit: options?.limit
      }
    });

    const messagesArray = [];

    if (messages.length > 0) for (let index = 0; index < messages.length; index++) messagesArray.push(await client.channels.resolve(channelID).messages.fetch(messages[ index ].id));

    return messagesArray;
  };

  /**
   * Pins the specified message to the channel.
   * @param {Message} message 
   * @returns {Promise<Message>}
   */
  async pin(message) {
    const messageError = new api.checker.BaseChecker(message).Error;
    messageError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'message'.")
      .setCondition("isNotObject")
      .setType("InvalidType")
      .throw();

    const channel = await ChannelManager.get(message.channel.id);
    const fetched = await this.get(channel.id, message.id);

    const pinned = await PUT(`${api.config.BASE_URL}/${api.config.VERSION}/channels/${channel.id}/pins/${fetched.id}`);

    const pinnedMessage = await client.channels.resolve(channel.id).messages.fetch(pinned.id);

    return pinnedMessage;
  };

  /**
   * Unpins the specified message to the channel.
   * @param {Message} message 
   * @returns {number}
   */
  async unpin(message) {
    const messageError = new api.checker.BaseChecker(message).Error;
    messageError.setName("ValidationError")
      .setMessage("An invalid type was specified for 'message'.")
      .setCondition("isNotObject")
      .setType("InvalidType")
      .throw();

    const channel = await ChannelManager.get(message.channel.id);
    const fetched = await this.get(channel.id, message.id);

    DELETE(`${api.config.BASE_URL}/${api.config.VERSION}/channels/${channel.id}/pins/${fetched.id}`);

    return 0;
  };
};