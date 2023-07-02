const en = {
  commands: {
    autoVc: {
      create: {
        contentYesNo: '**Do you want to create a VC auto-create category?**',
        createLimitCount: '>>> **※Only up to 3 VC auto-created categories can be created**',
        description: 'Create VC auto-create category',
      },
      channel: {
        archive: {
          name: 'archived VC',
          sendEmbed: {
            description: ">>> **- Automatically create and archive VC's.**",
            fields: [
              {
                name: 'log-condition:',
                value: '>>> **If only {0} was said in the channel, it will not be archived**',
              },
            ],
            title: 'About this channel',
          },
        },
        categoryName: 'Automatically created VC',
        voiceName: 'VC Creation Room',
      },
      delete: {
        description: 'Delete automatically created VC categories',
      },
      description: 'Delete automatically created VC categories',
      list: {
        description: 'Displays a list of automatically created VC categories',
      },
      undefined: '>>> **※VCNo data was available for the VC auto-creation category**',
    },
    buttonYesNo: {
      cancel: '**Command canceled.**',
      done: '**Command completed successfully**',
    },
    channel: {
      contentYesNo: '**Would you like to change the channel name of {0} to "{1}"?**',
      description: 'You can change the channel name',
      errorCode50035: '**※Channel name contained unsupported string**',
      nameLengthLimit: '**※Channel name must be 100 characters or less**',
      notOwnChannel: '**※This command can only be used on your own VC channel**',
      notTargetChannel: '**※This command is only available within automatically created channels in the following channels\n>>> {0}**',
      success: '**{0} channel names changed**',
    },
    guards: {
      noPermission: "**※You don't have full authorization.**",
    },
    options: {
      channelName: 'Specify channel name',
      maxLimit: 'Max number of people who can join VC',
    },
    processing: '**※Processing in progress...**',
  },
  handlers: {
    voiceStateUpdate: {
      autoVc: {
        create: {
          errorVoiceChannel: '**※Could not create VC with auto-creation**',
          sendEmbed: {
            description: '**For VC: {0} created.\n※If no one enters for 1 minute after everyone has left the VC, it will be automatically deleted.**',
            fields: [
              {
                name: 'List of available commands:',
                value: 'Only {0} can be used.',
              },
              {
                name: '/channel name:〇〇',
                value: 'It is possible to change the channel name to 00',
              },
            ],
            title: "{0}'s VC channel",
          },
        },
        delete: {
          stop: '>>> **The number of participants in {0} has been updated.\nDelete system is suspended.**',
        },
        update: {
          connectVc: '<@{0}> has joined.',
          disconnectVc: '<@{0}> has left the building.',
          noMemberInVoiceChannel: '>>> **The number of participants in {0} is now 0.\nNow if no one joins, {1} and {2} will be deleted automatically after 30 seconds.**',
        },
      },
    },
  },
} as const

export default en
