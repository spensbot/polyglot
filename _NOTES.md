# Notes

## Bias Update Ideas

- Focus on Learning/Seen ratio. That indicates how on-target the difficulty is. 
  - If the user hasn't requested any hints, despite seeing words, they need more difficult words. 
  - In contrast if they're asking for a hint on most words they see. They're in over their head and their stories should have more words they know, more easy words, and less words they're learning, or new words.
- Recommend bias words in buckets where the % of each bucket depends on the user's Learning/Seen ratio:
  - Learning
  - Known
  - Familiar
  - Unseen