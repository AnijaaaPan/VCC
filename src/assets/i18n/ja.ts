const ja = {
  commands: {
    autoVc: {
      channel: {
        archive: {
          name: 'アーカイブVC',
          sendEmbed: {
            description: '>>> **- 自動作成VCのアーカイブを行います**',
            fields: [{
              name: 'ログ条件:',
              value: '>>> **チャンネル内の発言が{0}のみだった場合はアーカイブ化を行いません**'
            }],
            title: 'このチャンネルについて'
          }
        },
        categoryName: '自動作成VC',
        extraCategoryName: 'VC ※一時的',
        voiceName: 'VC 作成部屋'
      },
      create: {
        completed: '>>> **※自動作成VCの作成が完了しました**',
        contentYesNo: '**VC自動作成カテゴリーを作成しますか？**',
        createLimitCount: '>>> **※VC自動作成カテゴリーは最大3つまでしか作成できません**',
        description: 'VC自動作成カテゴリーを作成します'
      },
      delete: {
        completed: '>>> **※削除が完了しました**',
        description: 'VC自動作成カテゴリーを削除する'
      },
      description: 'VC自動作成カテゴリーを操作します',
      list: {
        description: 'VC自動作成カテゴリー一覧を表示します'
      },
      role: {
        name: 'VC参加中'
      },
      undefined: '>>> **※VC自動作成カテゴリーのデータがありませんでした**',
      vcAutoCreateEmbed: {
        fields: [{
          name: 'カテゴリー:',
          value: '{0}'
        }, {
          name: 'アーカイブチャンネル:',
          value: '{0}'
        }, {
          name: 'VC自動作成チャンネル:',
          value: '{0}'
        }, {
          name: '通知役職:',
          value: '{0}'
        }],
        title: 'VC自動作成一覧:',
        undefinedChannel: '>>> **※チャンネルが確認できませんでした**',
        undefinedRole: '>>> **※役職が確認できませんでした**'
      }
    },
    buttonYesNo: {
      cancel: '**コマンドをキャンセルしました**',
      done: '**コマンドが正常に終了しました**'
    },
    channel: {
      contentYesNo: '**{0} のチャンネル名を『{1}』に変更しますか？**',
      description: 'チャンネル名を変更できます',
      errorCode50035: '**※チャンネル名に対応外の文字列が含まれていました**',
      nameLengthLimit: '**※チャンネル名は100文字以内にしてください**',
      notOwnChannel: '**※このコマンドは自分自身のVCチャンネルでないと使用できません**',
      notTargetChannel: '**※このコマンドは下記のチャンネルで自動的に作成されたチャンネル内でのみ使用可能です\n>>> {0}**',
      success: '**{0} のチャンネル名を変更しました**'
    },
    guards: {
      noPermission: '**※全権限がありません**'
    },
    options: {
      channelName: 'チャンネル名を指定',
      maxLimit: 'VCに参加できるMAX人数'
    },
    processing: '**※処理を実行中...**'
  },
  handlers: {
    voiceStateUpdate: {
      autoVc: {
        create: {
          errorVoiceChannel: '**※自動作成でVCを作成出来ませんでした**',
          sendEmbed: {
            description: '**VC用: {0}を作成しました。\n※VCから全員が退出後、1分間誰も入らなかった場合自動的に削除されます。**',
            fields: [{
              name: '使用可能コマンド一覧:',
              value: '{0}さんのみ使用可能です'
            }, {
              name: '/channel name:〇〇',
              value: 'チャンネル名を〇〇に変更することが可能です'
            }],
            title: '{0}さんのVCチャンネル'
          }
        },
        delete: {
          stop: '>>> **{0}の参加人数が更新されました。\n削除システムを中断します。**'
        },
        update: {
          connectVc: '<@{0}>さんが参加しました。',
          disconnectVc: '<@{0}>さんが退出しました。',
          noMemberInVoiceChannel: '>>> **{0}の参加人数が0人になりました。\nこのまま誰も参加しないと30秒後に{1}, {2}は自動的に削除されます。**'
        }
      }
    }
  }
} as const

export default ja
