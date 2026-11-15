import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('v3.5.1 worker uploads and collector download use the same release directory',()=>{
 const yaml=readFileSync('.github/workflows/battle-actor-scale-v351-validation.yml','utf8');
 const release=yaml.match(/VALIDATION_VERSION:\s*(v\d+)/)?.[1];assert.ok(release);
 const download=yaml.match(/pattern:\s*(v\d+)-\*[\s\S]*?path:\s*(\S+)/);assert.ok(download);
 assert.equal(download[1],release);assert.equal(download[2],`.ci-${release}-results`);
 assert.ok(yaml.includes(`path: .ci-${release}/unit`));assert.ok(yaml.includes(`path: .ci-${release}/\u0024{{ matrix.group }}`));
 const collector=readFileSync('tests/ci-v30-collect.mjs','utf8');assert.ok(collector.includes("const root='.ci-'+release+'-results'"));
});

// The balance job is independent of browser startup; every browser file is still partitioned once.
test('v3.6 balance receipt and full browser command are collected without deployment',()=>{
 const yaml=readFileSync('.github/workflows/combat-balance-v36-validation.yml','utf8');
 assert.ok(yaml.includes('needs: [unit, browsers, balance]'));
 assert.ok(yaml.includes('pattern: v36-*\n          path: .ci-v36-results'));
 assert.ok(yaml.includes('npm run test:browser-all -- --ci-group'));
 assert.ok(yaml.includes('node tests/ci-v30.mjs balance'));
 assert.ok(yaml.includes('path: .ci-v36/balance'));
 assert.ok(!yaml.includes('actions/deploy-pages'));
});

test('v3.7 growth integration collects every browser shard and preserves deployment isolation',()=>{
 const yaml=readFileSync('.github/workflows/growth-builds-v37-validation.yml','utf8');
 assert.ok(yaml.includes('needs: [unit, browsers, balance]'));
 assert.ok(yaml.includes('pattern: v37-*\n          path: .ci-v37-results'));
 assert.ok(yaml.includes('npm run test:browser-all -- --ci-group'));
 assert.ok(yaml.includes('VALIDATION_VERSION: v37'));
 assert.ok(!yaml.includes('actions/deploy-pages'));
});

test('v3.8 exploration collects every browser shard, survey receipt and no deployment',()=>{
 const yaml=readFileSync('.github/workflows/exploration-v38-validation.yml','utf8');
 assert.ok(yaml.includes('needs: [unit, browsers, balance]'));
 assert.ok(yaml.includes('pattern: v38-*\n          path: .ci-v38-results'));
 assert.ok(yaml.includes('npm run test:browser-all -- --ci-group'));
 assert.ok(yaml.includes('VALIDATION_VERSION: v38'));
 assert.ok(!yaml.includes('actions/deploy-pages'));
});
