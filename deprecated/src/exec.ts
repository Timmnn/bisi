import { spawnSync } from 'child_process'

// ANSI escape codes for colors
const Colors = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
}

export class BashCommand {
  command: string
  dryRun: boolean

  constructor(command: string, dryRun = false) {
    this.command = command
    this.dryRun = dryRun
  }

  run(print_output = true): { stdout: string; stderr: string; status: number | null } {

    if (print_output) {
      console.log(
        `${Colors.FgBlue}${Colors.Bright}Running command:${Colors.Reset} \`${this.command}\``
      )
    }

    if (this.dryRun) {
      console.log(
        `${Colors.FgYellow}[DRY RUN] Command not executed.${Colors.Reset}`
      )
      return { stdout: '', stderr: '', status: 0 }
    }

    const child = spawnSync(this.command, {
      shell: true,
      stdio: 'pipe',
      encoding: 'utf8',
    })

    const stdout = child.stdout ? child.stdout.toString() : ''
    const stderr = child.stderr ? child.stderr.toString() : ''

    if (stdout && print_output) {
      console.log(`${Colors.FgGreen}Output (stdout):${Colors.Reset}\n${stdout}`)
    }

    if (stderr && print_output) {
      console.error(`${Colors.FgRed}Errors (stderr):${Colors.Reset}\n${stderr}`)
    }

    if (child.status !== 0 && print_output) {
      console.error(
        `${Colors.FgRed}Command failed with exit code ${child.status}${Colors.Reset}`
      )
    } else if (print_output) {
      console.log(
        `${Colors.FgCyan}Command finished successfully.${Colors.Reset}`
      )
    }

    return { stdout, stderr, status: child.status }
  }
}
