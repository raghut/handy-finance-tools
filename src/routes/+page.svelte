<script lang="ts">
  import CalculatorCard from '$lib/components/CalculatorCard.svelte';

  const calculators: {
    title: string;
    description: string;
    icon: "calculator" | "percentage" | "brush";
    route: string;
  }[] = [
    {
      title: 'EMI Calculator',
      description: 'Calculate your monthly EMI payments for loans with our easy-to-use calculator.',
      icon: 'calculator',
      route: '/emi-calculator'
    },
    {
      title: 'Interest Amount Calculator',
      description: 'Calculate simple interest and CAGR for your investments.',
      icon: 'calculator',
      route: '/interest-calculator'
    },
    {
      title: 'Chit Calculator',
      description: 'Calculate rate of interest for auction amount',
      icon: 'percentage',
      route: '/chit-advanced'
    },
    {
      title: 'Interest Rate Calculator',
      description: 'Calculate rate of interest',
      icon: 'percentage',
      route: '/interest-rate-calculator',
    },
    {
      title: 'Kaleido Scope',
      description: 'Interactive symmetrical drawing tool',
      icon: 'brush',
      route: '/kaleido-scope',
    }
  ];
</script>

<div class="container" data-testid="calculator-hub-container" id="calculator-hub-container">
  <h1 data-testid="calculator-hub-title" id="calculator-hub-title">Financial Calculator Hub</h1>
  <div class="calculator-grid" data-testid="calculator-grid" id="calculator-grid">
    {#each calculators as calculator, index}
      <div id={`calculator-card-${index}`}>
        <CalculatorCard 
          {...calculator} 
          data_testid={`calculator-card-${index}`}
        />
      </div>
    {/each}
  </div>
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  h1 {
    text-align: center;
    color: #1a73e8;
    margin-bottom: 30px;
  }

  .calculator-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
</style>
