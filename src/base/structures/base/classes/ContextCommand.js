import { SlashCommand as ContextCommandStructure } from "./SlashCommand.js";

export class ContextCommand extends ContextCommandStructure {
  constructor(contextCommandOptions = { enabled: true, mode: "Global", permissions: [] }) {
    super();

    const { enabled, mode, permissions } = contextCommandOptions;

    const enabledChecker = new this.checker.BaseChecker(enabled);
    const modeChecker = new this.checker.BaseChecker(mode);
    const permissionsChecker = new this.checker.BaseChecker(permissions);

    if (permissionsChecker.isNotArray) this.permissions = [];

    if (enabledChecker.isBoolean && enabled === true) this.setEnabled();
    if (modeChecker.isString && mode.toLowerCase() === "developer") this.setMode();
  };
};