# Manobodha — Capstone Review 1 Technical Documentation

## 1. Executive Summary
Manobodha is an interactive, schema-driven web platform designed for psychology education, specializing in real-time simulations of behavioral theories (Operant Conditioning) and cognitive decay models (Ebbinghaus Forgetting Curve). Built on SvelteKit 5 (Runes mode), TypeScript, and Chart.js, the system decouples technical calculation logic from UI presentation.

---

## 2. System Architecture Diagram

```mermaid
graph TD
    subgraph Client Layer [SvelteKit Presentation Shell]
        Page["src/routes/+page.svelte<br/>(Main Workbench Shell)"]
        CP["src/lib/components/ControlPanel.svelte<br/>(Schema-Driven Inputs)"]
        OG["src/lib/components/OutputGraph.svelte<br/>(Chart.js Visualization)"]
    end

    subgraph Type System [Interface Contracts]
        Types["src/lib/types/theory.ts<br/>(ControlSchema, GraphConfig, GraphDataPoint)"]
    end

    subgraph Logic Layer [Simulation Engines]
        OC Engine["Operant Conditioning Engine<br/>(Reinforcement & Extinction Logic)"]
        EFC Engine["Ebbinghaus Curve Engine<br/>(Retention & Memory Decay Logic)"]
    end

    Page -->|Renders UI Controls| CP
    Page -->|Passes Plot Data| OG
    CP -->|Updates $state Values| Page
    Page -->|Calculates Data Points| OC Engine
    Page -->|Calculates Data Points| EFC Engine
    
    CP .->|Conforms To| Types
    OG .->|Conforms To| Types
    OC Engine .->|Conforms To| Types
    EFC Engine .->|Conforms To| Types
```

---

## 3. Interface & Type Contracts (`src/lib/types/theory.ts`)

### `ControlSchema`
Defines the dynamic metadata required to render interactive input controls in `ControlPanel.svelte`.

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique key identifying the parameter state. |
| `label` | `string` | User-facing title for the control UI element. |
| `type` | `'slider' \| 'dropdown' \| 'toggle'` | Render type specifying the UI widget. |
| `min` | `number` (optional) | Minimum range limit for sliders. |
| `max` | `number` (optional) | Maximum range limit for sliders. |
| `step` | `number` (optional) | Granularity increment value for sliders. |
| `defaultValue` | `number \| string \| boolean` | Fallback initialization value. |
| `options` | `ControlOption[]` (optional) | Label-value array for dropdown selections. |
| `tooltip` | `string` (optional) | WCAG accessibility description text. |

### `GraphConfig` & `GraphDataPoint`
Defines rendering attributes and coordinate payload structures for `OutputGraph.svelte`.

| Contract | Type / Properties | Usage |
| :--- | :--- | :--- |
| `GraphConfig` | `{ title, xAxisLabel, yAxisLabel, chartType? }` | Configures labels and mode (`line` or `bar`). |
| `GraphDataPoint` | `{ x: number, y: number }` | Represents standard coordinate values plotting time vs response. |

---

## 4. Component Hierarchy & Data Flow

* **`src/routes/+page.svelte`**: Orchestrates state using Svelte 5 `$state()` runes, managing parameter updates and passing reactive arrays to child components.
* **`src/lib/components/ControlPanel.svelte`**: Binds control parameters through `$bindable()` props and updates local state using native `oninput` and `onchange` events.
* **`src/lib/components/OutputGraph.svelte`**: Wraps Chart.js within a responsive container, utilizing `$effect()` to re-render dynamic dataset mutations without full component re-initialization.

---

## 5. Deployment & Tech Stack Verification

* **Framework**: SvelteKit 5 (Runes syntax `$props`, `$state`, `$effect`)
* **Styling & Layout**: Tailwind CSS, WCAG AA contrast standards
* **Data Visualization**: Chart.js v4
* **CI/CD Pipeline**: Vercel Git-integrated continuous integration