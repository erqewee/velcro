export const English = {
  data: {
    loader: {
      nodeError: "The project is not compatible with this NodeJS version.",
      handlers: {
        loading: "Handlers Loading ({loaded}/{total})",
        loadingError: "An error ocurred when loading handlers. | {err}",
        loaded: "Handlers Loaded. ({loaded}/{total})"
      },
      events: {
        loading: "Events Loading ({loaded}/{total})",
        loadingError: "An error ocurred when loading events. | {err}",
        loaded: "Events Loaded. ({loaded}/{total})"
      },
      commands: {
        loading: "Commands Loading ({loaded}/{total})",
        loadingError: "An error ocurred when loading commands. | {err}",
        loaded: "Commands Loaded. ({loaded}/{total})"
      },
      gateway: {
        connecting: "Connecting to Gateway ({processing}/{total})",
        connectionError: "An error ocurred when connecting to gateway. | {err}",
        connected: "Connected to Gateway. ({processing}/{total})"
      }
    },
    events: {
      util: {
        register: {
          title: "Register System",
          user: "Member",
          name: "Name",
          employee: "Employee",
          totalRegisterCount: "{user.tag}, You have a total of {count} records!",
          editMemberName: "Edit Member Name"
        },
        ready: {
          blacklist: {
            title: "{client.user.tag} - Black List | Added",
            description: "{successEmote} A user has been added to the blacklist.",
            fields: {
              employee: "{employeeEmote} Employee",
              date: "{calendarEmote} Date"
            }
          }
        },
        message: {
          blacklist: {
            title: "{client.user.username} - Subscribe System | BlackList Member",
            description: "{trashEmote} Sorry, you're blacklisted, find out below why you're blacklisted!",
            fields: {
              employee: "{employeeEmote} Employee",
              date: "{calendarEmote} Date",
              reason: "{notepadEmote} Reason"
            }
          },
          subscribe: {
            title: "{client.user.username} - Subscribe System",
            description: `Description`,
            fields: {
              add: "{checkEmote} Add Role"
            }
          }
        }
      },
      handlers: {
        interaction: {
          developerMessage: "{errorEmote} {member}, Are you {client.user} developer?",
          error: {
            userData: {
              title: "{errorEmote} An error ocurred.",
              description: "{notepadEmote} I'm reported this error to my Developers.",
              footer: {
                text: "> Please check again later..."
              }
            },
            reportData: {
              title: "{errorEmote} An error ocurred when executing command.",
              description: "```js\n{err}```",
              fields: {
                author: "{userEmote} Author",
                time: "{calendarEmote} Date",
                command: "{prototipEmote} Command"
              }
            }
          }
        }
      }
    }
  }
};