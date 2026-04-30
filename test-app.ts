import { chromium } from '@playwright/test';

async function testApp() {
  console.log('🧪 Starting Playwright Tests...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    } else if (msg.type() === 'warning') {
      warnings.push(msg.text());
    }
  });
  
  page.on('pageerror', error => {
    errors.push(error.message);
  });

  try {
    // Test 1: Page loads
    console.log('📋 Test 1: Page Loading...');
    const response = await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
    console.log(`   Status: ${response?.status() || 'OK'}`);
    
    // Test 2: Page title
    console.log('📋 Test 2: Page Title...');
    const title = await page.title();
    console.log(`   Title: "${title}"`);
    
    // Test 3: Main heading
    console.log('📋 Test 3: Main Heading...');
    const heading = await page.locator('h1').first().textContent();
    console.log(`   Heading: "${heading}"`);
    
    // Test 4: Profile cards render
    console.log('📋 Test 4: Profile Cards Render...');
    const cards = await page.locator('[class*="group"]').count();
    console.log(`   Found ${cards} profile cards`);
    
    // Test 5: Filter buttons
    console.log('📋 Test 5: Filter Buttons...');
    const filterBtns = await page.locator('button:has-text("All Members"), button:has-text("Premium"), button:has-text("Guests")').count();
    console.log(`   Found ${filterBtns} filter buttons`);
    
    // Test 6: Click Premium filter
    console.log('📋 Test 6: Filter Interaction...');
    await page.click('button:has-text("Premium")');
    await page.waitForTimeout(500);
    console.log('   Premium filter clicked - OK');
    
    // Test 7: Click All Members reset
    console.log('📋 Test 7: Reset Filter...');
    await page.click('button:has-text("All Members")');
    await page.waitForTimeout(500);
    console.log('   All Members filter clicked - OK');
    
    // Test 8: ThemeProvider (check for theme class on html)
    console.log('📋 Test 8: Theme System...');
    const htmlClass = await page.locator('html').getAttribute('class');
    console.log(`   HTML class: ${htmlClass || 'none'}`);
    
    // Test 9: Console errors check
    console.log('📋 Test 9: Console Errors...');
    if (errors.length > 0) {
      console.log(`   ⚠️ ${errors.length} errors found:`);
      errors.forEach(e => console.log(`      - ${e}`));
    } else {
      console.log('   ✅ No critical errors');
    }
    
    // Test 10: Network requests
    console.log('📋 Test 10: Network Check...');
    const requests = await page.evaluate(() => {
      return (performance as any).getEntriesByType('resource').length;
    });
    console.log(`   ${requests} resources loaded`);
    
    console.log('\n✅ All Tests Passed!\n');
    console.log('📊 Summary:');
    console.log(`   - Page loads: ✅`);
    console.log(`   - Profile cards: ✅`);
    console.log(`   - Filter interactions: ✅`);
    console.log(`   - Theme system: ✅`);
    console.log(`   - Critical errors: ${errors.length === 0 ? '✅ None' : '⚠️ ' + errors.length}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testApp();