# Chambers IQ Frontend - Complete Implementation Plan

## 📋 Executive Summary

Building a modern legal case management UI with 5 core modules:
1. Client Management
2. Case Management  
3. Document Management
4. Template Management
5. Document Drafting

**Approach:** Incremental development - one feature at a time, fully functional at each step.

---

## 🎯 Implementation Strategy

### Phase 1: Foundation (Week 1)
**Goal:** Working Next.js app with navigation

**Deliverables:**
1. ✅ Project setup (package.json, tsconfig, next.config)
2. ⏳ Tailwind configuration
3. ⏳ Global styles & design system
4. ⏳ Utility functions & helpers
5. ⏳ Type definitions (TypeScript interfaces)
6. ⏳ API client setup
7. ⏳ Core UI components (shadcn/ui style)
8. ⏳ **Landing Page/Dashboard** - Navigation hub

### Phase 2: Client Management (Week 2)
**Goal:** Complete client CRUD

**Deliverables:**
9. ⏳ Client list page with search & filters
10. ⏳ Add/Edit client form with type switching
11. ⏳ Individual client form fields
12. ⏳ Company client form fields
13. ⏳ Client detail view
14. ⏳ Client cards & table components

### Phase 3: Case Management (Week 3)
**Goal:** Full case lifecycle management

**Deliverables:**
15. ⏳ Case list page with filters
16. ⏳ Add/Edit case form
17. ⏳ Case summary section (P0 requirement)
18. ⏳ Party management
19. ⏳ Important dates section
20. ⏳ Case detail view

### Phase 4: Document Management (Week 4)
**Goal:** Upload, view, AI analysis

**Deliverables:**
21. ⏳ Document uploader (drag & drop)
22. ⏳ Document list view
23. ⏳ PDF viewer component
24. ⏳ AI analysis panel
25. ⏳ Document metadata editor

### Phase 5: Template Management (Week 5)
**Goal:** Create & manage templates

**Deliverables:**
26. ⏳ Template list page
27. ⏳ Template editor (manual)
28. ⏳ Placeholder system
29. ⏳ AI template generator
30. ⏳ Template preview

### Phase 6: Document Drafting (Week 6)
**Goal:** Split-screen editor with AI

**Deliverables:**
31. ⏳ Draft list page
32. ⏳ Split-screen layout
33. ⏳ Rich text editor
34. ⏳ AI chat panel
35. ⏳ Reference materials panel
36. ⏳ Export functionality

---

## 📁 File Structure (Complete)

```
chambers-iq-frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                          # Root layout
│   │   ├── page.tsx                            # ⏳ PHASE 1: Landing page
│   │   ├── globals.css                         # ⏳ PHASE 1: Global styles
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx                      # ⏳ PHASE 1: Dashboard shell
│   │   │   ├── page.tsx                        # ⏳ PHASE 1: Dashboard home
│   │   │   │
│   │   │   ├── clients/
│   │   │   │   ├── page.tsx                    # ⏳ PHASE 2: Clients list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx                # ⏳ PHASE 2: Add client
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx                # ⏳ PHASE 2: Client detail
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx            # ⏳ PHASE 2: Edit client
│   │   │   │
│   │   │   ├── cases/
│   │   │   │   ├── page.tsx                    # ⏳ PHASE 3: Cases list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx                # ⏳ PHASE 3: Add case
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx                # ⏳ PHASE 3: Case detail
│   │   │   │       ├── edit/
│   │   │   │       │   └── page.tsx            # ⏳ PHASE 3: Edit case
│   │   │   │       ├── documents/
│   │   │   │       │   └── page.tsx            # ⏳ PHASE 4: Documents
│   │   │   │       └── drafts/
│   │   │   │           └── page.tsx            # ⏳ PHASE 6: Drafts
│   │   │   │
│   │   │   ├── templates/
│   │   │   │   ├── page.tsx                    # ⏳ PHASE 5: Templates list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx                # ⏳ PHASE 5: Create template
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx                # ⏳ PHASE 5: Edit template
│   │   │   │
│   │   │   └── drafts/
│   │   │       ├── page.tsx                    # ⏳ PHASE 6: Drafts list
│   │   │       └── [id]/
│   │   │           └── page.tsx                # ⏳ PHASE 6: Draft editor
│   │   │
│   │   └── api/
│   │       └── auth/
│   │           └── [...nextauth]/
│   │               └── route.ts                # ⏳ PHASE 1: Auth (optional)
│   │
│   ├── components/
│   │   ├── ui/                                 # ⏳ PHASE 1: Core UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── table.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── radio-group.tsx
│   │   │   └── toast.tsx
│   │   │
│   │   ├── layout/                             # ⏳ PHASE 1: Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── DashboardNav.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── clients/                            # ⏳ PHASE 2: Client components
│   │   │   ├── ClientList.tsx
│   │   │   ├── ClientTable.tsx
│   │   │   ├── ClientFilters.tsx
│   │   │   ├── ClientForm.tsx                  # Main form with type switch
│   │   │   ├── IndividualClientForm.tsx        # Individual fields
│   │   │   ├── CompanyClientForm.tsx           # Company fields
│   │   │   ├── ClientCard.tsx
│   │   │   └── ClientStats.tsx
│   │   │
│   │   ├── cases/                              # ⏳ PHASE 3: Case components
│   │   │   ├── CaseList.tsx
│   │   │   ├── CaseTable.tsx
│   │   │   ├── CaseFilters.tsx
│   │   │   ├── CaseForm.tsx
│   │   │   ├── CaseSummarySection.tsx          # P0: Critical summary
│   │   │   ├── CaseDetailsSection.tsx
│   │   │   ├── PartiesSection.tsx
│   │   │   ├── ImportantDatesSection.tsx
│   │   │   ├── FinancialSection.tsx
│   │   │   ├── CaseCard.tsx
│   │   │   └── CaseTimeline.tsx
│   │   │
│   │   ├── documents/                          # ⏳ PHASE 4: Document components
│   │   │   ├── DocumentUploader.tsx            # Drag & drop
│   │   │   ├── DocumentList.tsx
│   │   │   ├── DocumentTable.tsx
│   │   │   ├── DocumentViewer.tsx              # PDF viewer
│   │   │   ├── AIAnalysisPanel.tsx             # AI summary
│   │   │   ├── DocumentFilters.tsx
│   │   │   └── UploadProgress.tsx
│   │   │
│   │   ├── templates/                          # ⏳ PHASE 5: Template components
│   │   │   ├── TemplateList.tsx
│   │   │   ├── TemplateTable.tsx
│   │   │   ├── TemplateEditor.tsx
│   │   │   ├── TemplatePlaceholderPanel.tsx
│   │   │   ├── AITemplateGenerator.tsx
│   │   │   ├── TemplatePreview.tsx
│   │   │   └── PlaceholderMenu.tsx
│   │   │
│   │   └── drafts/                             # ⏳ PHASE 6: Drafting components
│   │       ├── DraftList.tsx
│   │       ├── SplitScreenEditor.tsx           # Main editor layout
│   │       ├── AIChatPanel.tsx                 # Left: AI chat
│   │       ├── DraftEditor.tsx                 # Right: Document editor
│   │       ├── ReferencePanel.tsx              # Bottom: Case facts
│   │       ├── ChatMessage.tsx
│   │       └── EditorToolbar.tsx
│   │
│   ├── lib/
│   │   ├── utils.ts                            # ⏳ PHASE 1: Utility functions
│   │   ├── api-client.ts                       # ⏳ PHASE 1: Axios wrapper
│   │   ├── auth.ts                             # ⏳ PHASE 1: NextAuth (optional)
│   │   └── validations.ts                      # ⏳ PHASE 1: Zod schemas
│   │
│   └── types/
│       ├── client.ts                           # ⏳ PHASE 1: Client types
│       ├── case.ts                             # ⏳ PHASE 1: Case types
│       ├── document.ts                         # ⏳ PHASE 1: Document types
│       ├── template.ts                         # ⏳ PHASE 1: Template types
│       └── draft.ts                            # ⏳ PHASE 1: Draft types
│
├── public/                                     # Static assets
│   ├── images/
│   └── fonts/
│
├── .env.local                                  # ⏳ PHASE 1: Environment variables
├── tailwind.config.ts                          # ⏳ PHASE 1: Tailwind setup
├── postcss.config.js                           # ⏳ PHASE 1: PostCSS
├── tsconfig.json                               # ✅ DONE
├── next.config.js                              # ✅ DONE
├── package.json                                # ✅ DONE
└── README.md                                   # ⏳ PHASE 1: Project docs
```

---

## 🎨 Design System Specifications

### Color Palette
```typescript
// tailwind.config.ts
colors: {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',  // Primary blue
    600: '#2563eb',  // Darker blue
    700: '#1d4ed8',
  },
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  urgent: '#dc2626',
}
```

### Typography
- **Font:** Inter (headings) + System UI (body)
- **Sizes:** text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl
- **Weights:** font-normal (400), font-medium (500), font-semibold (600), font-bold (700)

### Spacing
- **Gaps:** gap-2 (0.5rem), gap-4 (1rem), gap-6 (1.5rem)
- **Padding:** p-4, p-6, p-8
- **Margins:** mt-4, mb-6, etc.

### Components
- **Cards:** `bg-white rounded-lg shadow-sm border p-6`
- **Buttons:** `px-4 py-2 rounded-md font-medium transition-colors`
- **Inputs:** `border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary`
- **Badges:** `px-2 py-1 rounded-full text-xs font-medium`

---

## 📊 Data Flow Architecture

```
Next.js Frontend (Port 3000)
        │
        │ HTTP Requests (axios)
        ↓
FastAPI Backend (Port 8000)
        │
        ├──→ DynamoDB (Cases, Documents, Users)
        ├──→ S3 (Document storage)
        └──→ AWS Bedrock (AI features)
```

### State Management
- **Server State:** TanStack Query (React Query)
- **Form State:** React Hook Form + Zod
- **UI State:** React useState/useReducer
- **Global State:** React Context (minimal use)

---

## 🔌 API Integration Points

### Client Endpoints
```typescript
GET    /api/v1/clients              // List all clients
POST   /api/v1/clients              // Create client
GET    /api/v1/clients/:id          // Get client
PUT    /api/v1/clients/:id          // Update client
DELETE /api/v1/clients/:id          // Delete client
GET    /api/v1/clients/search?q=    // Search clients
```

### Case Endpoints
```typescript
GET    /api/v1/cases                // List cases
POST   /api/v1/cases                // Create case
GET    /api/v1/cases/:id            // Get case
PUT    /api/v1/cases/:id            // Update case
GET    /api/v1/cases/:id/documents  // Case documents
POST   /api/v1/cases/:id/upload     // Upload document
```

### Document Endpoints
```typescript
POST   /api/v1/cases/:caseId/documents/:docId/process  // AI process
GET    /api/v1/cases/:caseId/documents/:docId/analysis // Get AI analysis
GET    /api/v1/cases/:caseId/documents/:docId/download // Download
```

### Template Endpoints
```typescript
GET    /api/v1/templates            // List templates
POST   /api/v1/templates            // Create template
POST   /api/v1/templates/generate   // AI generate from samples
```

### Draft Endpoints
```typescript
POST   /api/v1/drafts               // Create draft with AI
POST   /api/v1/drafts/:id/chat      // Chat with AI about draft
PUT    /api/v1/drafts/:id           // Update draft
GET    /api/v1/drafts/:id/export    // Export to PDF/DOCX
```

---

## 🚀 Build Order (Detailed)

### TODAY: Phase 1 - Foundation & Landing Page

**Files to Create:**
1. `tailwind.config.ts` - Tailwind configuration
2. `src/app/globals.css` - Global styles
3. `src/lib/utils.ts` - Utility functions (cn, formatDate, etc.)
4. `src/types/client.ts` - Client TypeScript interfaces
5. `src/types/case.ts` - Case TypeScript interfaces
6. `src/components/ui/button.tsx` - Button component
7. `src/components/ui/card.tsx` - Card component
8. `src/components/layout/Sidebar.tsx` - Sidebar navigation
9. `src/components/layout/Header.tsx` - Top header
10. `src/app/layout.tsx` - Root layout
11. `src/app/page.tsx` - **Landing page with dashboard navigation**
12. `src/app/(dashboard)/layout.tsx` - Dashboard layout wrapper

**Outcome:** Working landing page with navigation to all 5 modules

---

### NEXT: Phase 2 - Client Management

**Files to Create:**
13. `src/components/clients/ClientList.tsx`
14. `src/components/clients/ClientTable.tsx`
15. `src/components/clients/ClientFilters.tsx`
16. `src/components/clients/ClientForm.tsx`
17. `src/components/clients/IndividualClientForm.tsx`
18. `src/components/clients/CompanyClientForm.tsx`
19. `src/app/(dashboard)/clients/page.tsx`
20. `src/app/(dashboard)/clients/new/page.tsx`

**Outcome:** Complete client CRUD functionality

---

## 📝 Current Status

✅ **Completed:**
- Project setup (package.json, tsconfig, next.config)

⏳ **Next (Today):**
- Phase 1: Foundation & Landing Page (12 files)

⏳ **After That:**
- Phase 2: Client Management
- Phase 3: Case Management
- Phase 4: Document Management
- Phase 5: Template Management
- Phase 6: Document Drafting

---

## 💡 Testing Strategy

### Per Feature
1. **Build UI** - Create component and page
2. **Test UI** - Run `npm run dev`, verify visually
3. **Mock API** - Use static data first
4. **Integrate API** - Connect to FastAPI backend
5. **Test E2E** - Full workflow testing

### Tools
- **Dev Server:** `npm run dev`
- **Type Check:** `npm run type-check`
- **Lint:** `npm run lint`

---

## 🎯 Success Criteria

### Phase 1 Complete When:
- [ ] Landing page loads without errors
- [ ] Sidebar navigation works
- [ ] Can navigate to all 5 module pages (even if empty)
- [ ] Responsive design works on mobile/desktop
- [ ] TypeScript compiles without errors

### Phase 2 Complete When:
- [ ] Can add individual client
- [ ] Can add company client
- [ ] Form validates correctly
- [ ] Can search & filter clients
- [ ] Table displays client data
- [ ] Can edit/delete clients

---

**Ready to start Phase 1?** I'll create the landing page and foundation files now! 🚀
