const quoteText = document.querySelector("#quote-text");
const quoteAuthor = document.querySelector("#quote-author");
const statusMessage = document.querySelector("#status");
const newQuoteButton = document.querySelector("#new-quote");
const quoteCard = document.querySelector(".quote-card");

// DummyJSON's quotes endpoint is public and does not require an API key.
const QUOTES_API = "https://dummyjson.com/quotes/random";
let previousQuote = "";

async function fetchQuote() {
  newQuoteButton.disabled = true;
  quoteCard.setAttribute("aria-busy", "true");
  statusMessage.textContent = "Loading...";
  statusMessage.classList.remove("error");
  newQuoteButton.querySelector("span:first-child").textContent = "Finding a quote";

  try {
    let quote;
    // Retry once if the API returns the same quote as the previous one.
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const response = await fetch(QUOTES_API);
      if (!response.ok) throw new Error("The quote service is unavailable.");
      quote = await response.json();
      if (quote.quote !== previousQuote) break;
    }

    if (!quote || typeof quote.quote !== "string" || !quote.author) {
      throw new Error("The quote service returned an unexpected response.");
    }

    quoteText.textContent = `“${quote.quote}”`;
    quoteAuthor.textContent = `— ${quote.author}`;
    previousQuote = quote.quote;
    statusMessage.textContent = "";
  } catch (error) {
    statusMessage.textContent = "Couldn't load a quote. Check your internet and try again.";
    statusMessage.classList.add("error");
  } finally {
    newQuoteButton.disabled = false;
    quoteCard.setAttribute("aria-busy", "false");
    newQuoteButton.querySelector("span:first-child").textContent = "New quote";
  }
}

newQuoteButton.addEventListener("click", fetchQuote);
fetchQuote();
