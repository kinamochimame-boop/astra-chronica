/** Optional test-only time advancement. Real-clock timing/UI/WebGL suites do not opt in. */
export async function prepareBattleClock(page){if(process.env.BATTLE_VIRTUAL_CLOCK==='1')await page.clock.install()}
export async function waitAfterBattleInput(page){if(process.env.BATTLE_VIRTUAL_CLOCK==='1'){if(process.env.BATTLE_CLOCK_SKIP_FRAMES!=='0')await page.clock.fastForward(1000);else await page.clock.runFor(1000)}else await page.waitForTimeout(1000)}
