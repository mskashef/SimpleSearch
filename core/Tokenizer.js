class Tokenizer {
  static #stopWords = ['am', 'is', 'are', 'was', 'were', 'did', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'let', 'do', 'this', 'that', 'these', 'those', 'where', 'است', 'بود', 'شد', 'گشت', 'گردید', 'از', 'در', 'بر', 'با', 'برای', 'چون', 'زیرا', 'رفت', 'باید', 'من', 'تو', 'او', 'ما', 'شما', 'ایشان', 'آن', 'این', 'آنها'];
  static #separaters = ['\u200C', '~', '`', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '-', '=', '+', '[', ']', '{', '}', '\\', '|', ',', '.', '<', '>', '?', '/', '،', '؛', ',', '«', '»'];
  static #nulls = ['ً', 'ٌ', 'ٍ', 'َ', 'ُ', 'ِ', 'ْ', 'ّ', 'ـ'];
  static #persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  static #normalizeChar = ch => {
    switch (ch) {
      case 'ۀ': case 'ة': return 'ه';
      case 'ي': return 'ی';
      case 'ك': return 'ک';
      case 'إ': case 'ء': case 'أ': return 'ئ';
      case 'ؤ': return 'و';
    }
    if (Tokenizer.#separaters.includes(ch)) return ' ';
    if (Tokenizer.#nulls.includes(ch)) return '';
    if (this.#isPersianDigit(ch)) return this.#convertPersianDigitToEnglishDigit(ch);
    return ch;
  }

  static #normalize = body => {
    let res = body.toLowerCase().trim();
    let finalResult = "";
    for (let i = 0; i < res.length; i++) {
      finalResult += this.#normalizeChar(res.charAt(i));
    }
    return finalResult.toString();
  }

  static #isPersianDigit = digit => Tokenizer.#persianDigits.includes(digit);

  static #convertPersianDigitToEnglishDigit = digit => {
    return {
      '۰': '0',
      '١': '1',
      '۲': '2',
      '۳': '3',
      '۴': '4',
      '۵': '5',
      '۶': '6',
      '۷': '7',
      '۸': '8',
      '۹': '9',
    }[digit];
  }

  static tokenize = (query) => {
    return this.#normalize(query).split(/\s+/);
    // let result = this.#normalize(query).split(/\s+/);
    // let res = [];
    // for (const token of result)
    //   if (!this.#stopWords.includes(token)) {
    //     res.push(token)
    //   }
    // return res;
  }
}
module.exports = Tokenizer;