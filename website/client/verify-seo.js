#!/usr/bin/env node

/**
 * VynceAI SEO Verification Script
 * Run this after deploying to verify SEO setup
 */

const https = require('https');
const http = require('http');

const SITE_URL = 'https://vynceai.imnitz.tech';
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

console.log(`${colors.blue}🔍 VynceAI SEO Verification${colors.reset}\n`);

const tests = [
  {
    name: 'Homepage loads',
    test: async () => {
      return new Promise((resolve) => {
        https.get(SITE_URL, (res) => {
          resolve(res.statusCode === 200);
        }).on('error', () => resolve(false));
      });
    }
  },
  {
    name: 'robots.txt accessible',
    test: async () => {
      return new Promise((resolve) => {
        https.get(`${SITE_URL}/robots.txt`, (res) => {
          resolve(res.statusCode === 200);
        }).on('error', () => resolve(false));
      });
    }
  },
  {
    name: 'sitemap.xml accessible',
    test: async () => {
      return new Promise((resolve) => {
        https.get(`${SITE_URL}/sitemap.xml`, (res) => {
          resolve(res.statusCode === 200);
        }).on('error', () => resolve(false));
      });
    }
  },
  {
    name: 'OG image exists',
    test: async () => {
      return new Promise((resolve) => {
        https.get(`${SITE_URL}/og-image.png`, (res) => {
          resolve(res.statusCode === 200);
        }).on('error', () => resolve(false));
      });
    }
  },
  {
    name: 'Meta tags present',
    test: async () => {
      return new Promise((resolve) => {
        https.get(SITE_URL, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            const hasTitle = data.includes('<title>VynceAI');
            const hasMeta = data.includes('meta name="description"');
            const hasOG = data.includes('property="og:');
            resolve(hasTitle && hasMeta && hasOG);
          });
        }).on('error', () => resolve(false));
      });
    }
  },
  {
    name: 'Structured data present',
    test: async () => {
      return new Promise((resolve) => {
        https.get(SITE_URL, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            resolve(data.includes('application/ld+json'));
          });
        }).on('error', () => resolve(false));
      });
    }
  }
];

async function runTests() {
  console.log(`Testing: ${SITE_URL}\n`);
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    process.stdout.write(`${test.name}... `);
    try {
      const result = await test.test();
      if (result) {
        console.log(`${colors.green}✓ PASS${colors.reset}`);
        passed++;
      } else {
        console.log(`${colors.red}✗ FAIL${colors.reset}`);
        failed++;
      }
    } catch (error) {
      console.log(`${colors.red}✗ ERROR${colors.reset}`);
      failed++;
    }
  }
  
  console.log(`\n${colors.blue}Results:${colors.reset}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  if (failed > 0) {
    console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  }
  
  console.log(`\n${colors.yellow}Next steps:${colors.reset}`);
  console.log('1. Test with PageSpeed Insights: https://pagespeed.web.dev/');
  console.log('2. Test with Facebook Debugger: https://developers.facebook.com/tools/debug/');
  console.log('3. Test with Twitter Card Validator: https://cards-dev.twitter.com/validator');
  console.log('4. Submit to Google Search Console');
  console.log('\nFor full checklist, see: SEO_CHECKLIST.md');
}

runTests().catch(console.error);
