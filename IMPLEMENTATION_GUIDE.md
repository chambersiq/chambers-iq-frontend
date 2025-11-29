# Chambers IQ Frontend - Complete Implementation Guide

## 🎯 Project Created!

Location: `/Users/ganesh/my-projects/lawyers/chambers-iq-frontend`

---

## ✅ Files Created So Far

1. ✅ `package.json` - All dependencies configured
2. ✅ `tsconfig.json` - TypeScript setup
3. ✅ `next.config.js` - Next.js configuration

---

## 📦 Installation & Setup

```bash
cd /Users/ganesh/my-projects/lawyers/chambers-iq-frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## 🏗️ Critical Files to Create Next

### 1. Tailwind Configuration
**File:** `tailwind.config.ts`

### 2. Global Styles
**File:** `src/app/globals.css`

### 3. Utility Functions
**File:** `src/lib/utils.ts`

### 4. Type Definitions
- `src/types/client.ts`
- `src/types/case.ts`
- `src/types/document.ts`
- `src/types/template.ts`

### 5. API Client
**File:** `src/lib/api-client.ts`

### 6. Core UI Components (shadcn/ui style)
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/table.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/form.tsx`

### 7. Layout Components
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/DashboardNav.tsx`

### 8. Page Components
- `src/app/layout.tsx` - Root layout
- `src/app/page.tsx` - Landing page
- `src/app/(dashboard)/layout.tsx` - Dashboard layout
- `src/app/(dashboard)/page.tsx` - Dashboard home
- `src/app/(dashboard)/clients/page.tsx` - Clients list
- `src/app/(dashboard)/clients/new/page.tsx` - Add client
- `src/app/(dashboard)/clients/[id]/page.tsx` - Client detail

### 9. Client Components
- `src/components/clients/ClientList.tsx`
- `src/components/clients/ClientForm.tsx` - Main form with type switching
- `src/components/clients/IndividualClientForm.tsx`
- `src/components/clients/CompanyClientForm.tsx`
- `src/components/clients/ClientCard.tsx`
- `src/components/clients/ClientFilters.tsx`

### 10. Case Components
- `src/components/cases/CaseList.tsx`
- `src/components/cases/CaseForm.tsx`
- `src/components/cases/CaseSummarySection.tsx`
- `src/components/cases/CaseTimeline.tsx`
- `src/components/cases/PartySection.tsx`

### 11. Document Components
- `src/components/documents/DocumentUploader.tsx`
- `src/components/documents/DocumentList.tsx`
- `src/components/documents/DocumentViewer.tsx`
- `src/components/documents/AIAnalysisPanel.tsx`

### 12. Template Components
- `src/components/templates/TemplateList.tsx`
- `src/components/templates/TemplateEditor.tsx`
- `src/components/templates/TemplatePlaceholderPanel.tsx`
- `src/components/templates/AITemplateGenerator.tsx`

### 13. Drafting Components
- `src/components/drafts/SplitScreenEditor.tsx`
- `src/components/drafts/AIChatPanel.tsx`
- `src/components/drafts/DraftEditor.tsx`
- `src/components/drafts/ReferencePanel.tsx`

---

##  🎨 Design System

### Colors (Tailwind)
- **Primary:** Blue 600 (legal professional)
- **Secondary:** Slate 700
- **Success:** Green 600
- **Warning:** Orange 500
- **Error:** Red 600
- **Urgent:** Red 700
- **Background:** White / Slate 50

### Typography
- **Headings:** Inter (Google Fonts)
- **Body:** system-ui
- **Monospace:** JetBrains Mono (for code/placeholders)

### Component Patterns
- **Cards:** Shadow-sm, rounded-lg, border
- **Buttons:** Solid primary, outline secondary, ghost tertiary
- **Forms:** Floating labels, inline validation
- **Tables:** Striped rows, sticky header
- **Modals:** Full-screen overlay, centered content

---

## 🔥 Key Features Implementation

### Client Management
- **Type Switching:** Radio buttons change form fields dynamically
- **Validation:** Zod schemas, real-time validation
- **Search:** Debounced search across name, email, phone
- **Filters:** Multi-select dropdowns with clear all
- **Table:** Sortable columns, pagination, row actions

### Case Management  
- **Case Summary:** Rich text editor with minimum length validation
- **Party Management:** Add multiple parties dynamically
- **Important Dates:** Calendar picker with reminders
- **Related Cases:** Multi-select with search
- **Auto-save:** Draft save every 30 seconds

### Document Management
- **Drag & Drop:** Full-screen drop zone
- **Progress:** Upload progress bar per file
- **AI Processing:** Real-time status updates with SSE
- **PDF Viewer:** react-pdf with zoom, navigation
- **Annotations:** Highlight, comment on PDF

### Templates
- **Placeholder System:** {{client_name}}, {{case_number}}, etc.
- **Preview Mode:** Show template with sample data
- **AI Generation:** Upload samples, AI learns, generates template
- **Version Control:** Track template versions

### Drafting
- **Split Screen:** Resizable panels (chat 40%, editor 60%)
- **Real-time Updates:** Highlight changed sections
- **Context Awareness:** Select text, ask AI about it
- **Reference Panel:** Collapsible bottom panel with case facts
- **Export:** PDF, DOCX formats

---

## 📊 State Management

### React Query (TanStack Query)
```typescript
// Example: Fetch clients
const { data: clients, isLoading } = useQuery({
  queryKey: ['clients'],
  queryFn: () => apiClient.get('/api/v1/clients')
})

// Mutations for create/update
const createClient = useMutation({
  mutationFn: (client: Client) => apiClient.post('/api/v1/clients', client),
  onSuccess: () => queryClient.invalidateQueries(['clients'])
})
```

### Form State (React Hook Form + Zod)
```typescript
const form = useForm<ClientFormData>({
  resolver: zodResolver(clientSchema),
  defaultValues: { clientType: 'individual' }
})
```

---

## 🔌 API Integration

### API Client Setup
```typescript
// src/lib/api-client.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Add auth token to requests
apiClient.interceptors.request.use(async (config) => {
  const session = await getSession()
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }
  return config
})
```

### API Endpoints
- `GET /api/v1/clients` - List clients
- `POST /api/v1/clients` - Create client
- `GET /api/v1/cases` - List cases
- `POST /api/v1/cases/{id}/upload` - Upload document
- `POST /api/v1/drafts` - Generate draft with AI

---

## 🚀 Next Steps to Complete UI

### Phase 1: Core Setup (Do First)
1. Run `npm install` in chambers-iq-frontend
2. Create Tailwind config
3. Create global styles
4. Create utility functions
5. Create type definitions

### Phase 2: UI Components
6. Create all shadcn/ui components (button, card, etc.)
7. Create layout components (sidebar, header)
8. Create landing page

### Phase 3: Client Management (P0)
9. Client list page
10. Client form with type switching
11. Individual client form
12. Company client form

### Phase 4: Case Management (P0)
13. Case list page
14. Case form with summary section
15. Case detail page

### Phase 5: Documents (P0)
16. Document uploader
17. Document viewer
18. AI analysis panel

### Phase 6: Templates & Drafting (P0)
19. Template management
20. AI template generator
21. Split-screen draft editor
22. AI chat integration

---

## 💡 Would You Like Me To:

**Option A:** Generate the top 20 most critical files now (components, types, API client)

**Option B:** Create a starter template you can customize

**Option C:** Generate code snippets for each feature that you can copy-paste

**Which would be most helpful?** I can generate production-ready code for any of these options! 🚀
