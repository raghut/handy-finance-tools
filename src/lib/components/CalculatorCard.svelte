<script lang="ts">
  export let title: string;
  export let description: string;
  export let icon: 'calculator' | 'percentage';
  export let route: string;
  export let data_testid: string = '';
</script>

<div class="calculator-card" data-testid={data_testid}>
  <div class="icon" data-testid={`${data_testid}-icon`}>
    {#if icon === 'calculator'}
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="#1a73e8" data-testid={`${data_testid}-calculator-icon`}>
        <path d="M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v16h16V4H4zm2 2h12v2H6V6zm0 4h2v2H6v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8 4h2v2H6v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8 4h2v2H6v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"/>
      </svg>
    {:else if icon === 'percentage'}
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="#1a73e8" data-testid={`${data_testid}-percentage-icon`}>
        <path d="M18.5 3.5L3.5 18.5l2 2L20.5 5.5l-2-2zM7 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm10 10a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
      </svg>
    {/if}
  </div>
  <h2 data-testid={`${data_testid}-title`}>{title}</h2>
  <p data-testid={`${data_testid}-description`}>{description}</p>
  <a href={route} data-testid={`${data_testid}-link`}>Calculate Now</a>
</div>

<style>
  .calculator-card {
    background: white;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
  }

  .calculator-card:hover {
    transform: translateY(-5px);
  }

  .icon {
    margin-bottom: 15px;
  }

  h2 {
    margin: 0;
    color: #333;
    font-size: 1.5rem;
  }

  p {
    color: #666;
    margin: 10px 0;
  }

  a {
    display: inline-block;
    padding: 10px 20px;
    background-color: #1a73e8;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    margin-top: 10px;
    transition: background-color 0.3s ease;
  }

  a:hover {
    background-color: #1557b0;
  }
</style> 