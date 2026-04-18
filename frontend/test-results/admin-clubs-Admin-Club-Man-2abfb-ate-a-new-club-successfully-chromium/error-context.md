# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-clubs.spec.js >> Admin Club Management >> should create a new club successfully
- Location: tests\admin-clubs.spec.js:4:3

# Error details

```
Error: No students available in the dropdown
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - link "SLIIT Events Logo" [ref=e6] [cursor=pointer]:
      - /url: /
      - img "SLIIT Events Logo" [ref=e7]
    - navigation [ref=e9]:
      - generic [ref=e10]:
        - heading "MAIN MENU" [level=3] [ref=e11]
        - generic [ref=e12]:
          - link "Home" [ref=e13] [cursor=pointer]:
            - /url: /
            - img [ref=e14]
            - text: Home
          - link "Clubs" [ref=e17] [cursor=pointer]:
            - /url: /clubs
            - img [ref=e18]
            - text: Clubs
          - link "Events Calendar" [ref=e22] [cursor=pointer]:
            - /url: /calendar
            - img [ref=e23]
            - text: Events Calendar
      - generic [ref=e25]:
        - heading "ADMINISTRATION" [level=3] [ref=e26]
        - generic [ref=e27]:
          - link "System Dashboard" [ref=e28] [cursor=pointer]:
            - /url: /admin
            - img [ref=e29]
            - text: System Dashboard
          - link "Manage Clubs" [ref=e32] [cursor=pointer]:
            - /url: /admin/clubs
            - img [ref=e33]
            - text: Manage Clubs
          - link "Manage Users" [ref=e37] [cursor=pointer]:
            - /url: /admin/users
            - img [ref=e38]
            - text: Manage Users
          - link "Merchandise Approvals" [ref=e43] [cursor=pointer]:
            - /url: /admin/merch
            - img [ref=e44]
            - text: Merchandise Approvals
          - link "Reports" [ref=e48] [cursor=pointer]:
            - /url: /admin/reports
            - img [ref=e49]
            - text: Reports
  - generic [ref=e52]:
    - navigation [ref=e53]:
      - generic [ref=e55]:
        - generic [ref=e59]: UPCOMING EVENTS
        - generic [ref=e61]:
          - generic [ref=e62]:
            - img "Club" [ref=e63]
            - generic [ref=e64]: "LEO CLUB:"
            - generic [ref=e65]: Annual Meeting
            - generic [ref=e66]:
              - img [ref=e67]
              - text: Main Hall
            - generic [ref=e69]:
              - img [ref=e70]
              - text: March 28th at 09:00
          - generic [ref=e74]:
            - img "Club" [ref=e75]
            - generic [ref=e76]: "FOSS SLIIT:"
            - generic [ref=e77]: GIT Learning part 3
            - generic [ref=e78]:
              - img [ref=e79]
              - text: Main Auditorium
            - generic [ref=e81]:
              - img [ref=e82]
              - text: April 6th at 21:50
          - generic [ref=e86]:
            - img "Club" [ref=e87]
            - generic [ref=e88]: "MS CLUB:"
            - generic [ref=e89]: Web Development Bootcamp
            - generic [ref=e90]:
              - img [ref=e91]
              - text: Main Auditorium
            - generic [ref=e93]:
              - img [ref=e94]
              - text: April 8th at 10:00
          - generic [ref=e98]:
            - img "Club" [ref=e99]
            - generic [ref=e100]: "SLIIT Gaming Community:"
            - generic [ref=e101]: SLIIT PUBG MOBILE ELITE SHOWDOWN 2026
            - generic [ref=e102]:
              - img [ref=e103]
              - text: New Building Auditorium
            - generic [ref=e105]:
              - img [ref=e106]
              - text: April 20th at 10:00
          - generic [ref=e110]:
            - img "Club" [ref=e111]
            - generic [ref=e112]: "SLIIT Gaming Community:"
            - generic [ref=e113]: SLIIT VALORANT CHAMPIONSHIP 2026
            - generic [ref=e114]:
              - img [ref=e115]
              - text: New Building Auditorium
            - generic [ref=e117]:
              - img [ref=e118]
              - text: April 28th at 08:30
      - generic [ref=e121]:
        - button [ref=e122] [cursor=pointer]:
          - img [ref=e123]
        - generic [ref=e126]:
          - generic [ref=e127]: SLIIT Event
          - generic [ref=e128]: superadmin
        - button "Logout" [ref=e129] [cursor=pointer]:
          - img [ref=e130]
    - main [ref=e133]:
      - generic [ref=e135]:
        - generic [ref=e136]:
          - button [ref=e137] [cursor=pointer]:
            - img [ref=e138]
          - generic [ref=e140]:
            - heading "Add New Club" [level=1] [ref=e141]
            - paragraph [ref=e142]: Create a new student organization
        - generic [ref=e144]:
          - generic [ref=e145]:
            - generic [ref=e146]: Club Name *
            - textbox "Club Name *" [ref=e147]:
              - /placeholder: e.g. FOSS SLIIT
              - text: PlaywrightClubfnabf
          - generic [ref=e148]:
            - generic [ref=e149]: Description *
            - textbox "Description *" [active] [ref=e150]:
              - /placeholder: Tell us about the club...
              - text: This is a test club description for Playwright testing.
          - generic [ref=e151]:
            - generic [ref=e152]: Assign President *
            - combobox "Assign President *" [ref=e153]:
              - option "Select a student..." [selected]
              - option "snp (IT55669874)"
              - option "nimna (IT23661660)"
              - option "Malindu (IT23674776)"
              - option "Isuru Bimsara (it23674912)"
              - option "Yasanga (IT23335578)"
              - option "isuru jayasinhe (IT23711888)"
              - option "tharaka (IT52364178)"
              - option "vishwa (IT78945645)"
              - option "malindu (IT96325874)"
              - option "Denuwan (PT12345238)"
              - option "Sumane (fefefefe)"
              - option "Suma Perera Edited (ITSTU001)"
          - generic [ref=e154]:
            - generic [ref=e156]:
              - generic [ref=e157]: Club Logo
              - generic [ref=e158]:
                - button "Choose File" [ref=e159]
                - generic [ref=e160] [cursor=pointer]:
                  - img [ref=e161]
                  - generic [ref=e164]:
                    - generic [ref=e165]: Upload a file
                    - paragraph [ref=e166]: or drag and drop
                  - paragraph [ref=e167]: Supports jpeg, png. Max 2MB
            - generic [ref=e169]:
              - generic [ref=e170]: Cover Photo
              - generic [ref=e171]:
                - button "Choose File" [ref=e172]
                - generic [ref=e173] [cursor=pointer]:
                  - img [ref=e174]
                  - generic [ref=e177]:
                    - generic [ref=e178]: Upload a file
                    - paragraph [ref=e179]: or drag and drop
                  - paragraph [ref=e180]: Supports jpeg, png. Max 5MB
          - generic [ref=e181]:
            - button "Cancel" [ref=e182] [cursor=pointer]
            - button "Create Club" [ref=e183] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Admin Club Management', () => {
  4  |   test('should create a new club successfully', async ({ page }) => {
  5  |     await page.goto('/admin/clubs');
  6  |     await expect(page).toHaveURL(/.*\/admin\/clubs/);
  7  |     
  8  |     // Check if we are on the clubs page
  9  |     await expect(page.locator('h1:has-text("Manage Clubs")')).toBeVisible();
  10 |     
  11 |     // Click on "Add New Club" button
  12 |     await page.click('button:has-text("Add New Club")');
  13 |     await expect(page).toHaveURL(/.*\/admin\/clubs\/add/);
  14 |     
  15 |     // Fill the form with a unique name
  16 |     const randomSuffix = Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 5);
  17 |     const clubName = `PlaywrightClub${randomSuffix}`;
  18 |     await page.fill('input#clubName', clubName);
  19 |     await page.fill('textarea#description', 'This is a test club description for Playwright testing.');
  20 |     
  21 |     // Select a president - try to find one that works or just pick one
  22 |     // We'll try the first few options
  23 |     const optionsCount = await page.locator('select#presidentId option').count();
  24 |     if (optionsCount <= 1) {
> 25 |       throw new Error('No students available in the dropdown');
     |             ^ Error: No students available in the dropdown
  26 |     }
  27 | 
  28 |     // Try selecting the last one in the list (less likely to be taken)
  29 |     await page.selectOption('select#presidentId', { index: optionsCount - 1 });
  30 |     
  31 |     // Click Create Club and wait for navigation
  32 |     await page.click('button[type="submit"]:has-text("Create Club")');
  33 |     
  34 |     // Wait for success toast to potentially appear and then redirect
  35 |     await expect(page).toHaveURL(/.*\/admin\/clubs/, { timeout: 15000 });
  36 |     
  37 |     // Verify the new club exists in the list
  38 |     await expect(page.locator(`text=${clubName}`).first()).toBeVisible();
  39 |     
  40 |     // Take a screenshot for documentation
  41 |     await page.screenshot({ path: 'test-results/screenshots/create-club-success.png' });
  42 |   });
  43 | });
  44 | 
```