export interface InterviewChapter {
  time: string;
  seconds: number;
  title: string;
  description: string;
}

export interface InterviewComment {
  id: string;
  author: string;
  avatar: string;
  handle: string;
  timeAgo: string;
  text: string;
  likes: number;
  isLiked?: boolean;
}

export interface InterviewItem {
  id: string;
  episodeNumber: number;
  title: string;
  category: string;
  thumbnail: string;
  videoUrl?: string;
  isPodcast?: boolean;
  podcastSeries?: string;
  duration: string;
  durationSeconds: number;
  views: string;
  viewCountRaw: number;
  uploadedAgo: string;
  isLive?: boolean;
  liveViewers?: string;
  guest: {
    name: string;
    role: string;
    company: string;
    avatar: string;
    subscribers: string;
  };
  host: {
    name: string;
    role: string;
    avatar?: string;
  };
  executiveSummary: string;
  featuredQuote: {
    text: string;
    timestamp: string;
  };
  chapters: InterviewChapter[];
  comments: InterviewComment[];
  tags: string[];
}

export const ALL_INTERVIEWS: InterviewItem[] = [
  {
    id: 'episode-42',
    episodeNumber: 42,
    title: 'Scaling Laws, Constitutional AI, and the Timeline to Autonomous Software Engineers',
    category: 'AI & Reasoning',
    thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    duration: '48:20',
    durationSeconds: 2900,
    views: '342K views',
    viewCountRaw: 342810,
    uploadedAgo: '2 days ago',
    guest: {
      name: 'Dario Amodei',
      role: 'CEO & Co-Founder',
      company: 'Anthropic',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      subscribers: '185K subscribers',
    },
    host: {
      name: 'Elena Vance',
      role: 'Editor-in-Chief',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    executiveSummary:
      'In this in-depth 48-minute dialogue, Anthropic CEO Dario Amodei outlines the operational inflection points transforming frontier model development. Moving past the simplistic paradigm of scale alone, the discussion details how autonomous synthesis, recursive self-validation, and multi-agent coordination are redefining enterprise software creation.',
    featuredQuote: {
      text: "Within 18 months, our internal benchmark for an autonomous engineer isn't whether it can pass LeetCode; it's whether it can independently navigate a 12-million-line legacy repository, identify security debt, submit a verified patch, and defend it during human architectural review.",
      timestamp: '19:42',
    },
    chapters: [
      { time: '00:08', seconds: 8, title: 'Introduction: The Post-Transformer Epoch', description: 'Opening assessment on model convergence and reasoning systems.' },
      { time: '04:15', seconds: 255, title: 'Why Compute Efficiency Outpaces Algorithmic Stagnation', description: 'Hardware level improvements and optical interconnect architectures.' },
      { time: '12:38', seconds: 758, title: 'Inside Constitutional AI 3.0: Formal Verification', description: 'Deploying mathematical proofs as constitutional rules.' },
      { time: '19:40', seconds: 1180, title: 'Autonomous Model Synthesizers in Production', description: 'How internal engineering teams integrate self-bootstrapping code swarms.' },
      { time: '27:18', seconds: 1638, title: 'The Sovereign Datacenter Buildout in the Middle East', description: 'Energy constraints, sovereign nation alliances, and GW-scale compute.' },
      { time: '38:50', seconds: 2330, title: 'When Does AI Write 100% of Production Commits?', description: 'Predictive timelines for human elimination from boilerplate commits.' },
      { time: '45:18', seconds: 2718, title: 'Closing Thoughts on Operator Responsibility & Security', description: 'Final recommendations for founding engineering teams.' },
    ],
    comments: [
      {
        id: 'c-1',
        author: 'David Marcus',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        handle: '@dmarcus_ai',
        timeAgo: '1 day ago',
        text: 'The distinction Dario draws between heuristic alignment and mathematical formal verification at 12:38 is the most critical conceptual shift of 2026.',
        likes: 124,
      },
      {
        id: 'c-2',
        author: 'Kavita Raman',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
        handle: '@kavita_systems',
        timeAgo: '18 hours ago',
        text: 'Notice how he specifically avoids mentioning pre-training cluster size and immediately pivots to test-time inference compute budgets. The paradigm has truly changed.',
        likes: 89,
      },
      {
        id: 'c-3',
        author: 'Lucas Vance',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        handle: '@lvance_kernel',
        timeAgo: '6 hours ago',
        text: 'Best technical interview on the internet right now. The production telemetry overlay and chapter breakdowns make this a masterclass.',
        likes: 45,
      },
    ],
    tags: ['Anthropic', 'Claude 3.5 Sonnet', 'Constitutional AI', 'Reasoning Models', 'Software Engineering'],
  },
  {
    id: 'episode-41',
    episodeNumber: 41,
    title: 'Deploying Humanoids into BMW Assembly Lines: Sub-Millimeter Torque & Visuomotor Nets',
    category: 'Robotics & Embodied AI',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    duration: '36:45',
    durationSeconds: 2205,
    views: '215K views',
    viewCountRaw: 215400,
    uploadedAgo: '5 days ago',
    guest: {
      name: 'Brett Adcock',
      role: 'Founder & CEO',
      company: 'Figure AI',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      subscribers: '142K subscribers',
    },
    host: {
      name: 'Elena Vance',
      role: 'Editor-in-Chief',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    executiveSummary:
      'Figure AI CEO Brett Adcock breaks down the real production telemetry from their ongoing autonomous deployments inside BMW manufacturing plants, detailing harmonic drive actuators and neural sensorimotor loops.',
    featuredQuote: {
      text: 'Humanoid robots will not enter homes first; they must conquer the high-mix, high-torque industrial line where every second of downtime costs $22,000.',
      timestamp: '14:20',
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'BMW Factory Deployment Overview', description: 'Telemetry from Spartanburg plant.' },
      { time: '08:12', seconds: 492, title: 'Strain-Wave Actuators vs Planetary Gears', description: 'Why titanium harmonic drives won out.' },
      { time: '18:30', seconds: 1110, title: 'Visuomotor Neural Policies', description: 'End-to-end perception to motor torque.' },
      { time: '30:00', seconds: 1800, title: 'The Path to 100,000 Units Annually', description: 'Supply chain and factory scaling.' },
    ],
    comments: [
      {
        id: 'c-4',
        author: 'Julian Thorne',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        handle: '@jthorne_mech',
        timeAgo: '2 days ago',
        text: 'The footage of Figure 02 handling sheet metal with sub-millimeter positioning tolerances is insane.',
        likes: 67,
      },
    ],
    tags: ['Figure AI', 'Humanoid Robotics', 'Embodied AI', 'Manufacturing', 'BMW'],
  },
  {
    id: 'episode-40',
    episodeNumber: 40,
    title: 'Connecting 34 African Sovereign Currencies: Bypassing SWIFT with Instant FX Settlement',
    category: 'Fintech & Sovereign Rails',
    thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    duration: '29:14',
    durationSeconds: 1754,
    views: '128K views',
    viewCountRaw: 128900,
    uploadedAgo: '1 week ago',
    isLive: false,
    guest: {
      name: 'Olugbenga Agboola',
      role: 'CEO & Founder',
      company: 'Flutterwave',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
      subscribers: '98K subscribers',
    },
    host: {
      name: 'Elena Vance',
      role: 'Editor-in-Chief',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    executiveSummary:
      'Olugbenga Agboola discusses how localized liquidity pools and sovereign currency bridges are eliminating synthetic dollar conversions across emerging corridors.',
    featuredQuote: {
      text: 'Intra-African trade should not require routing through correspondent banks in Frankfurt or New York. Real-time net settlement is financial sovereignty.',
      timestamp: '09:45',
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'The Multi-Day Clearing Problem', description: 'Why correspondent banking fails emerging markets.' },
      { time: '11:20', seconds: 680, title: 'Sovereign Currency Liquidity Bridges', description: 'Direct corridor settlement mechanics.' },
      { time: '22:15', seconds: 1335, title: 'Stablecoins as Enterprise Treasury Tools', description: 'Eliminating FX volatility buffers.' },
    ],
    comments: [
      {
        id: 'c-5',
        author: 'Amina Diop',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
        handle: '@aminadiop_fx',
        timeAgo: '4 days ago',
        text: 'This is the reality of African commerce today. Over $10B monthly volume moving through these new corridors.',
        likes: 92,
      },
    ],
    tags: ['Flutterwave', 'Fintech', 'Sovereign Rails', 'Africa', 'Cross-Border FX'],
  },
  {
    id: 'episode-39',
    episodeNumber: 39,
    title: 'Breaking the Memory Wall: Co-Packaged Silicon Photonics in 100T Parameter Clusters',
    category: 'Silicon & Optics',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    duration: '52:18',
    durationSeconds: 3138,
    views: '184K views',
    viewCountRaw: 184200,
    uploadedAgo: '1 week ago',
    guest: {
      name: 'Aris Thorne & Priya Nair',
      role: 'Founders',
      company: 'Aperture Silicon',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      subscribers: '110K subscribers',
    },
    host: {
      name: 'Elena Vance',
      role: 'Editor-in-Chief',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    executiveSummary:
      'A deep technical masterclass on silicon photonics, electro-absorption optical modulators, and why copper wiring cannot support next-generation GPU interconnect bandwidth.',
    featuredQuote: {
      text: 'Electrons generate excessive heat when pushed beyond 200Gbps. Photons through glass fibers are the only physics-compatible path for 100-trillion parameter clusters.',
      timestamp: '23:10',
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'The Thermodynamics of Copper Wires', description: 'Thermal limits of conventional interconnects.' },
      { time: '15:40', seconds: 940, title: 'Co-Packaged Optics on 3nm CMOS', description: 'Integrating lasers directly into chip packages.' },
      { time: '34:20', seconds: 2060, title: 'Energy Dissipation per Bit', description: 'Dropping from 15pJ/bit to 0.8pJ/bit.' },
    ],
    comments: [
      {
        id: 'c-6',
        author: 'Hardware Architect',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        handle: '@semi_deepdive',
        timeAgo: '3 days ago',
        text: 'The explanation of optical waveguides on standard TSMC lines was crystal clear. Pure engineering gold.',
        likes: 110,
      },
    ],
    tags: ['Silicon Photonics', 'CPO', 'Semiconductors', 'Datacenter', 'GPU Clusters'],
  },
  {
    id: 'episode-38',
    episodeNumber: 38,
    title: 'The Gigawatt Dilemma: Molten Sodium Thermal Storage for Off-Grid Datacenter Power',
    category: 'Clean Baseload Energy',
    thumbnail: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80',
    duration: '34:02',
    durationSeconds: 2042,
    views: '156K views',
    viewCountRaw: 156800,
    uploadedAgo: '2 weeks ago',
    guest: {
      name: 'Dr. Tunde Balogun',
      role: 'CEO & Co-Founder',
      company: 'Kora Power',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      subscribers: '84K subscribers',
    },
    host: {
      name: 'Elena Vance',
      role: 'Editor-in-Chief',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    executiveSummary:
      'Why public utility grids cannot supply 500MW to 1GW clusters within the next 5 years, and how off-grid molten sodium thermal batteries are bridging the AI energy chasm.',
    featuredQuote: {
      text: 'You can order 50,000 GPUs tomorrow, but you will wait until 2031 for a substation transformer upgrade. Energy is the ultimate gating factor.',
      timestamp: '11:15',
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'The Grid Queuing Crisis', description: 'Why waiting for utility interconnections is fatal.' },
      { time: '12:00', seconds: 720, title: 'Molten Sodium at 600°C', description: 'Levelized cost of storage at $22/MWh.' },
      { time: '24:30', seconds: 1470, title: 'Autonomous Off-Grid Islanding', description: 'Zero dependency on municipal power grids.' },
    ],
    comments: [
      {
        id: 'c-7',
        author: 'Grid Engineer',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        handle: '@power_grid_analyst',
        timeAgo: '1 week ago',
        text: 'The math checks out. High-temp sodium beats lithium hands down for multi-day duration storage.',
        likes: 58,
      },
    ],
    tags: ['Clean Energy', 'AI Datacenters', 'Sodium Storage', 'Baseload', 'Grid Constraints'],
  },
  {
    id: 'episode-37',
    episodeNumber: 37,
    title: 'Neutral-Atom Topological Arrays: Demonstrating 48 Fault-Tolerant Logical Qubits',
    category: 'Quantum Computing',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
    duration: '44:30',
    durationSeconds: 2670,
    views: '89K views',
    viewCountRaw: 89400,
    uploadedAgo: '3 weeks ago',
    guest: {
      name: 'Dr. Hans Weber',
      role: 'CEO & Co-Founder',
      company: 'Vortex Quantum',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      subscribers: '72K subscribers',
    },
    host: {
      name: 'Elena Vance',
      role: 'Editor-in-Chief',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    executiveSummary:
      'Neutral-atom quantum processor breakthroughs: how laser-trapped rubidium arrays eliminate dilution refrigerator requirements and achieve error-corrected logical quantum gates.',
    featuredQuote: {
      text: 'Physical qubits without fault-tolerance are just expensive random number generators. Logical qubits with transversal CNOT gates are the threshold of quantum utility.',
      timestamp: '17:50',
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'Trapping Atoms with Optical Tweezers', description: 'Laser array manipulation of individual rubidium atoms.' },
      { time: '14:20', seconds: 860, title: 'Surface Code Error Correction', description: 'Grouping 30 physical qubits into one pristine logical qubit.' },
      { time: '31:40', seconds: 1900, title: 'Simulating Catalyst Molecules', description: 'Commercial chemistry contracts with BASF and Merck.' },
    ],
    comments: [
      {
        id: 'c-8',
        author: 'Quantum Theorist',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        handle: '@q_physicist',
        timeAgo: '2 weeks ago',
        text: 'The 3D spatial light modulators they built are an engineering marvel. Neutral atoms are clearly leading the fault-tolerant race.',
        likes: 41,
      },
    ],
    tags: ['Quantum Computing', 'Neutral Atoms', 'Fault Tolerance', 'Qubits', 'Physics'],
  },
  {
    id: 'episode-36',
    episodeNumber: 36,
    title: 'De Novo Generative Protein Diffusion: Programming Synthetic Enzymes for Oncology',
    category: 'BioTech & Health',
    thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80',
    duration: '41:10',
    durationSeconds: 2470,
    views: '98K views',
    viewCountRaw: 98100,
    uploadedAgo: '3 weeks ago',
    guest: {
      name: 'Dr. Rachel Sterling',
      role: 'CEO & Co-Founder',
      company: 'Cellular Synthesis',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      subscribers: '65K subscribers',
    },
    host: {
      name: 'Elena Vance',
      role: 'Editor-in-Chief',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    executiveSummary:
      'Designing synthetic non-immunogenic enzymes from first principles using structural 3D diffusion models to breach solid tumors without triggering human immune rejection.',
    featuredQuote: {
      text: 'Nature evolved proteins for organismal survival, not human medicine. Computational de novo design lets us build targeted molecular nanomachines that nature never explored.',
      timestamp: '20:15',
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'Limitations of Directed Evolution', description: 'Why random mutation is too slow for complex payloads.' },
      { time: '16:00', seconds: 960, title: 'Generative 3D Protein Diffusion', description: 'Generating coordinate backbones directly from target receptors.' },
      { time: '29:40', seconds: 1780, title: 'Preclinical Pancreatic Tumor Clearance', description: 'In-vivo results and human Phase 1 timeline.' },
    ],
    comments: [
      {
        id: 'c-9',
        author: 'Bioinformatics Lead',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        handle: '@computational_bio',
        timeAgo: '3 weeks ago',
        text: 'The wet-lab automation pipeline synthesizing 20k candidates a week is where their true moat lies. Incredible work.',
        likes: 73,
      },
    ],
    tags: ['BioTech', 'Protein Engineering', 'Diffusion Models', 'Oncology', 'Synthetic Biology'],
  },
  {
    id: 'episode-35',
    episodeNumber: 35,
    title: 'Kernel-Level eBPF Hooks for GPU VRAM: Defending Against Indirect Prompt Injection',
    category: 'Cybersecurity',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    duration: '27:50',
    durationSeconds: 1670,
    views: '172K views',
    viewCountRaw: 172600,
    uploadedAgo: '1 month ago',
    guest: {
      name: 'Victor Ramos',
      role: 'CEO & Co-Founder',
      company: 'ZeroTrace Shield',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      subscribers: '124K subscribers',
    },
    host: {
      name: 'Elena Vance',
      role: 'Editor-in-Chief',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    executiveSummary:
      'Former NSA TAO operator Victor Ramos exposes how indirect prompt injections bypass application firewalls and why kernel-level eBPF memory monitoring on GPU PCIe buses is essential.',
    featuredQuote: {
      text: 'If your defense is an LLM trying to judge another LLM, you have already lost. The defense must sit in the Linux kernel inspecting memory buses at hardware speed.',
      timestamp: '08:30',
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'The Fallacy of Prompt Guards', description: 'Why application-level guardrails fail adversarial bypasses.' },
      { time: '09:15', seconds: 555, title: 'eBPF Probes on NVIDIA PCIe Drivers', description: 'Sub-microsecond telemetry without CPU overhead.' },
      { time: '19:40', seconds: 1180, title: 'Autonomous Agent Tool Execution Containment', description: 'Preventing rogue shell command execution.' },
    ],
    comments: [
      {
        id: 'c-10',
        author: 'Red Team Operator',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        handle: '@kernel_redteam',
        timeAgo: '1 month ago',
        text: 'This is the first actual security architecture for LLM agents that makes technical sense. Hooking the driver memory is brilliant.',
        likes: 148,
      },
    ],
    tags: ['Cybersecurity', 'eBPF', 'Kernel', 'Prompt Injection', 'GPU VRAM', 'Zero-Trust'],
  },
  {
    id: 'podcast-ep-14',
    episodeNumber: 14,
    title: 'The NexTake Podcast: Silicon Photonics, 100T Parameter Clusters & The Death of Copper',
    category: 'Podcasts & Audio',
    isPodcast: true,
    podcastSeries: 'The NexTake Audio Monographs',
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
    duration: '54:12',
    durationSeconds: 3252,
    views: '89K listens',
    viewCountRaw: 89400,
    uploadedAgo: '3 days ago',
    guest: {
      name: 'Dr. Aris Thorne',
      role: 'Chief Optical Architect',
      company: 'Aperture Silicon',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      subscribers: '65K listeners',
    },
    host: {
      name: 'Elena Vance',
      role: 'Editor-in-Chief',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    executiveSummary:
      'In this audio monograph, Dr. Aris Thorne discusses the physics boundaries of modern GPU interconnects, why copper wiring fails at multi-gigahertz frequencies, and how electro-absorption optical modulators will define the next decade of AI data centers.',
    featuredQuote: {
      text: 'Every gigawatt datacenter of 2028 is a thermal management challenge disguised as a computer. Light through silica waveguides is our only physical escape hatch.',
      timestamp: '21:04',
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'Episode Intro: The Physics Wall of Copper', description: 'Thermal limits and signal attenuation.' },
      { time: '14:20', seconds: 860, title: 'Silicon Waveguide Lithography', description: 'Etching sub-micron optical paths directly on silicon.' },
      { time: '32:15', seconds: 1935, title: 'Energy Dissipation & Net Compute Efficiency', description: 'Reaching 0.5 picojoules per bit.' },
      { time: '48:30', seconds: 2910, title: 'The Next Wave of Hardware Standards', description: 'Open optical standards and consortium roadmap.' },
    ],
    comments: [
      {
        id: 'pod-c1',
        author: 'Telecom Engineer',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        handle: '@photon_lead',
        timeAgo: '1 day ago',
        text: 'The audio clarity and level of depth in this podcast is unmatched in the industry.',
        likes: 42,
      },
    ],
    tags: ['Podcast', 'Silicon Photonics', 'Hardware', 'Interconnects', 'Datacenters'],
  },
  {
    id: 'podcast-ep-13',
    episodeNumber: 13,
    title: 'The NexTake Podcast: Sovereign Rails, Africa FX Corridors & Instant Settlement',
    category: 'Podcasts & Audio',
    isPodcast: true,
    podcastSeries: 'The NexTake Audio Monographs',
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80',
    duration: '42:10',
    durationSeconds: 2530,
    views: '112K listens',
    viewCountRaw: 112300,
    uploadedAgo: '6 days ago',
    guest: {
      name: 'Olugbenga Agboola',
      role: 'CEO & Founder',
      company: 'Flutterwave',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
      subscribers: '98K listeners',
    },
    host: {
      name: 'Elena Vance',
      role: 'Editor-in-Chief',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    executiveSummary:
      'A deep podcast conversation on how bilateral central bank liquidity agreements and real-time payment switches are removing SWIFT correspondent banking fees from African cross-border trade.',
    featuredQuote: {
      text: 'Bypassing synthetic dollar conversions cuts trading friction by 800 basis points. That is not just financial efficiency; it is sovereign GDP growth.',
      timestamp: '16:45',
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'Corridor Frictions in Emerging Markets', description: 'Legacy correspondent routing.' },
      { time: '12:30', seconds: 750, title: 'Local Currency Liquidity Pools', description: 'Direct NGN-KES-GHS pairing.' },
      { time: '28:10', seconds: 1690, title: 'Stablecoins in Enterprise Treasuries', description: 'Real-time settlement mechanisms.' },
    ],
    comments: [
      {
        id: 'pod-c2',
        author: 'Fintech Founder',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
        handle: '@lagos_fintech',
        timeAgo: '3 days ago',
        text: 'Essential listening for anyone building treasury infrastructure in high-growth corridors.',
        likes: 64,
      },
    ],
    tags: ['Podcast', 'Fintech', 'Sovereign Rails', 'Payments', 'Africa'],
  },
];
