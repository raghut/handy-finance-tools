<script lang="ts">
  export let title: string;
  export let description: string;
  export let icon: 'calculator' | 'percentage' | 'brush';
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
    {:else if icon === 'brush'}
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="#1a73e8" data-testid={`${data_testid}-brush-icon`}>
        <path d="M20.71 4.04a1 1 0 0 0-1.41 0L14 9.34l.66.67l5.3-5.3c.39-.4.39-1.03 0-1.42M8 16a3 3 0 1 1 3 3a3 3 0 0 1-3-3m14-12.3L11.6 14.1a4.94 4.94 0 0 0-1.71 1.7a5 5 0 0 0-6.75 6.75l1.42 1.43l1.53-1.53l1.07 1.06l1.4-1.4l-1.06-1.06l1.54-1.53l-1.42-1.43c.35-.56.89-1.1 1.45-1.45a4.94 4.94 0 0 0 1.7-1.7L20.7 3.7a2.1 2.1 0 0 0 0-2.97a2.1 2.1 0 0 0-2.97 0z"/>
      </svg>
    {/if}
  </div>
  <h2 data-testid={`${data_testid}-title`}>{title}</h2>
  <p data-testid={`${data_testid}-description`}>{description}</p>
  <a href={route} data-testid={`${data_testid}-link`}>
    {#if icon === 'brush'}
      Draw Now
    {:else}
      Calculate Now
    {/if}
  </a>
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