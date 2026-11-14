import {chromium} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';
export const scaleWidths=[320,375,390,430],scaleHeights=[193,300,345];
export const imageDir='docs/screenshots/v351';
export async function loadScaleFixture(page,url){await page.goto(url+'/tests/atb-ui-v30.fixture.html');await page.waitForFunction(()=>window.atbFixture?.ready())}
export async function configureScale(page,height,config={}){
 await page.evaluate(config=>window.atbFixture.configure(config),config);
 await page.evaluate(height=>{const art=document.querySelector('.battle-art');art.style.flex='0 0 auto';art.style.height=height+'px';art.style.minHeight=height+'px';art.style.maxHeight=height+'px';},height);
 await page.waitForFunction(()=>{const f=window.atbFixture.figures(),c=document.querySelector('canvas').getBoundingClientRect();return c.height>0&&f.height===Math.round(f.width*c.height/c.width)});
}
export async function scaleMetrics(page){return page.evaluate(()=>{const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}};return {figures:window.atbFixture.figures(),canvas:rect('canvas'),field:rect('.battle-art'),party:rect('.party'),enemies:rect('.enemies'),execute:rect('.execute-command'),horizontal:document.documentElement.scrollWidth>innerWidth}})}
export async function captureScale(page,label,width,height,kind){const file=`${label}-${kind}-h${height}-${width}.png`;await page.screenshot({path:imageDir+'/'+file,fullPage:true,animations:'disabled'});return {...await scaleMetrics(page),width,height,kind,file}}
export async function captureScaleSet(page,label){const cases=[];mkdirSync(imageDir,{recursive:true});for(const width of scaleWidths){await page.setViewportSize({width,height:844});for(const height of scaleHeights){await configureScale(page,height);cases.push(await captureScale(page,label,width,height,'normal'))}await configureScale(page,345,{encounter:'final-astra-end'});cases.push(await captureScale(page,label,width,345,'boss'))}writeFileSync(imageDir+'/'+label+'-metrics.json',JSON.stringify(cases,null,2));return cases}
async function main(){const [label,url]=process.argv.slice(2);if(!['before','after'].includes(label)||!url)throw Error('before|after URL required');const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});try{const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});await loadScaleFixture(page,url);const cases=await captureScaleSet(page,label);console.log('PASS v3.5.1 capture',label,cases.length)}finally{await browser.close()}}
if(process.argv[1]?.endsWith('capture-actor-scale-v351.mjs'))await main();
