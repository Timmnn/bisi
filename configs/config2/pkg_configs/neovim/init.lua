require 'options'

local lazypath = vim.fn.stdpath 'data' .. '/lazy/lazy.nvim'
if not (vim.uv or vim.loop).fs_stat(lazypath) then
  local lazyrepo = 'https://github.com/folke/lazy.nvim.git'
  local out = vim.fn.system { 'git', 'clone', '--filter=blob:none', '--branch=stable', lazyrepo, lazypath }
  if vim.v.shell_error ~= 0 then
    error('Error cloning lazy.nvim:\n' .. out)
  end
end ---@diagnostic disable-next-line: undefined-field
vim.opt.rtp:prepend(lazypath)
require('lazy').setup({ { import = 'plugins' } }, {
  ui = {
    -- If you are using a Nerd Font: set icons to an empty table which will use the
    -- default lazy.nvim defined Nerd Font icons, otherwise define a unicode icons table
    icons = vim.g.have_nerd_font and {} or {
      cmd = '⌘',
      config = '🛠',
      event = '📅',
      ft = '📂',
      init = '⚙',
      keys = '🗝',
      plugin = '🔌',
      runtime = '💻',
      require = '🌙',
      source = '📄',
      start = '🚀',
      task = '📌',
      lazy = '💤 ',
    },
  },
  root = vim.fn.stdpath 'data' .. '/lazy',
})

-- The line beneath this is called `modeline`. See `:help modeline`
-- vim: ts=2 sts=2 sw=2 et

vim.api.nvim_create_autocmd({ 'BufReadPost', 'BufNewFile' }, {
  pattern = '*.fu',
  callback = function()
    vim.cmd 'TSBufEnable highlight'
  end,
})

vim.keymap.set('n', '<leader>st', function()
  vim.lsp.buf.hover()
end, { buffer = bufnr, desc = 'Show type of variable' })

vim.api.nvim_create_autocmd('BufWritePost', {
  pattern = '*.qml',
  callback = function(args)
    local filepath = vim.api.nvim_buf_get_name(args.buf)
    vim.fn.system { 'qmlformat', filepath, '-i' }
    -- Reload buffer to reflect on-disk changes
    vim.api.nvim_command 'checktime'
  end,
})
