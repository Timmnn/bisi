function find_closest_venv_python(start_path)
  local path = start_path
  while path and path ~= '/' do
    local venv_path = path .. '/.venv'
    if vim.fn.isdirectory(venv_path) == 1 then
      return venv_path .. '/bin/python'
    end
    venv_path = path .. '/venv'
    if vim.fn.isdirectory(venv_path) == 1 then
      return venv_path .. '/bin/python'
    end
    path = vim.fn.fnamemodify(path, ':h') -- Go up one directory
  end
  return 'python' -- Fallback to default python if no venv found
end

return {

  {
    'neovim/nvim-lspconfig',
    config = function()
      local lspconfig = require 'lspconfig'
      local util = require 'lspconfig.util'
      -- Shared on_attach function for all LSPs
      local on_attach = function(client, bufnr)
        -- Keymap for showing type of variable under cursor

        vim.keymap.set('n', 'gd', function()
          vim.lsp.buf.definition()
        end, { buffer = bufnr, desc = 'Show type of variable' })
      end

      -- Setup for Lua
      lspconfig.lua_ls.setup {
        on_attach = on_attach,
      }

      lspconfig.pest_ls.setup {
        on_attach = on_attach,
        filetypes = { 'pest' },
        settings = {
          pest = {
            -- Add any pest-specific settings here if needed
          },
        },
      }

      lspconfig.ts_ls.setup {
        on_attach = on_attach,
        filetypes = { 'javascript', 'javascriptreact', 'typescript', 'typescriptreact' },
        root_dir = lspconfig.util.root_pattern('package.json', 'tsconfig.json', '.git'),
      }

      -- Pyright configuration
      --

      lspconfig.pyright.setup {
        on_attach = on_attach,
      }

      --[[
      lspconfig.pyright.setup {
        on_attach = on_attach,
        -- Key change: dynamically set the 'cmd' for pyright
        cmd = function(bufnr, root_dir)
          local python_executable = find_closest_venv_python(root_dir)
          -- This assumes pyright is installed and accessible in your PATH
          -- or you can provide the full path to pyright if it's not global
          return { python_executable, '-m', 'pyright-langserver', '--stdio' }
        end,
        -- No 'settings.python.pythonPath' needed here if you use cmd
      }
      ]]
      --

      -- Setup for Java
      lspconfig.jdtls.setup {
        on_attach = on_attach,
      }

      -- Setup for C/C++
      lspconfig.clangd.setup {
        on_attach = on_attach,
      }

      -- Setup for Go
      lspconfig.gopls.setup {
        on_attach = on_attach,
      }

      -- Setup for HTML
      lspconfig.html.setup {
        on_attach = on_attach,
      }

      -- Setup for CSS
      lspconfig.cssls.setup {
        on_attach = on_attach,
      }

      -- Setup for Emmet
      lspconfig.emmet_ls.setup {
        on_attach = on_attach,
        filetypes = { 'html', 'css', 'javascript', 'javascriptreact', 'typescript', 'typescriptreact' },
        init_options = {
          html = {
            options = {
              -- Enable Emmet abbreviations in HTML
              ['bem.enabled'] = true, -- Enable BEM support
              ['output.selfClosingStyle'] = 'xhtml', -- Use self-closing tags
            },
          },
          css = {
            options = {
              -- Enable Emmet in CSS
              ['bem.enabled'] = true,
            },
          },
        },
      }
    end,
  },
  {
    'pmizio/typescript-tools.nvim',
    dependencies = { 'nvim-lua/plenary.nvim', 'neovim/nvim-lspconfig' },
    opts = {},
  },
}
