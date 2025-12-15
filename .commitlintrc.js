module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type 枚举
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert'
      ]
    ],
    // Scope 枚举
    'scope-enum': [
      2,
      'always',
      [
        'backend',
        'admin',
        'miniprogram',
        'mobile-admin',
        'shared',
        'infra'
      ]
    ],
    // Subject 必须包含 AI 工具标识
    'subject-case': [0], // 禁用默认的 case 检查
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    // 自定义规则: 必须包含 AI 工具标识
    'ai-tool-tag': [2, 'always']
  },
  plugins: [
    {
      rules: {
        'ai-tool-tag': ({ subject }) => {
          const aiToolPattern = /\[(claude-code|codex|antigravity|human)\]$/;
          const hasTag = aiToolPattern.test(subject);

          return [
            hasTag,
            hasTag
              ? ''
              : 'Subject 必须以 AI 工具标识结尾: [claude-code], [codex], [antigravity], 或 [human]'
          ];
        }
      }
    }
  ]
};
