const { webkit } = require('playwright');

(async () => {
    // Launch browser (using webkit which works better on macOS)
    const browser = await webkit.launch({ 
        headless: false,  // Show the browser window
        slowMo: 50        // Slow down actions by 50ms for visibility
    });
    
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });
    
    const page = await context.newPage();
    
    // Navigate to the travel log
    await page.goto('http://localhost:8080');
    
    console.log('✅ Travel Log opened in Playwright browser');
    console.log('📍 Page title:', await page.title());
    
    // Wait a moment to see the page
    await page.waitForTimeout(2000);
    
    // Test Command K search
    console.log('🔍 Testing Command K search...');
    await page.keyboard.press('Meta+k');
    await page.waitForTimeout(1000);
    
    // Type a search query
    await page.type('#searchInput', 'London');
    await page.waitForTimeout(1000);
    
    // Close search
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    
    // Click on a travel entry to test the modal
    const firstEntry = await page.$('.travel-entry.clickable');
    if (firstEntry) {
        console.log('📝 Opening travel entry for editing...');
        await firstEntry.click();
        await page.waitForTimeout(2000);
    }
    
    // Keep browser open for manual testing
    console.log('🌐 Browser will stay open for manual testing');
    console.log('✨ Close the browser window when done');
    
    // Wait indefinitely (user will close browser manually)
    await new Promise(() => {});
})();