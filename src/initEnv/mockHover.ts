// import { parse } from "./css";

// const HOVER_SELECTOR = /([^\\]):hover/;
// const HOVER_SELECTOR_GLOBAL = new RegExp(HOVER_SELECTOR.source, "g");


// // based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
// function escapeRegExp(str: string) {
//   return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
// }

// function addHoverClass(cssText: string): string {

//   const ast = parse(cssText, {
//     silent: true,
//   });

//   if (!ast.stylesheet) {
//     return cssText;
//   }

//   const selectors: string[] = [];
//   ast.stylesheet.rules.forEach((rule) => {
//     if ("selectors" in rule) {
//       (rule.selectors || []).forEach((selector: string) => {
//         if (HOVER_SELECTOR.test(selector)) {
//           selectors.push(selector);
//         }
//       });
//     }
//   });

//   if (selectors.length === 0) {
//     return cssText;
//   }

//   const selectorMatcher = new RegExp(
//     selectors
//       .filter((selector, index) => selectors.indexOf(selector) === index)
//       .sort((a, b) => b.length - a.length)
//       .map((selector) => {
//         return escapeRegExp(selector);
//       })
//       .join("|"),
//     "g"
//   );

//   const result = cssText.replace(selectorMatcher, (selector) => {
//     const newSelector = selector.replace(HOVER_SELECTOR_GLOBAL, "$1.yrecord-hover");
//     return `${selector}, ${newSelector}`;
//   });
//   return result;
// }


// function getCssRulesString(s: CSSStyleSheet): string | null {
//   try {
//     const rules = s.rules || s.cssRules;
//     return rules ? Array.from(rules).map(getCssRuleString).join('') : null;
//   } catch (error) {
//     return null;
//   }
// }

// function getCssRuleString(rule: CSSRule): string {
//   let cssStringified = rule.cssText;
//   if (isCSSImportRule(rule)) {
//     try {
//       cssStringified = getCssRulesString(rule.styleSheet) || cssStringified;
//     } catch {
//       // ignore
//     }
//   }
//   return cssStringified;
// }
// function isCSSImportRule(rule: CSSRule): rule is CSSImportRule {
//   return 'styleSheet' in rule;
// }

// export function mockHover(doc:Document){
//     const styleSheets = Array.from(doc.styleSheets)
//     for(let styleSheet of styleSheets){
//         const rules = Array.from(styleSheet.cssRules) as CSSStyleRule[]
//         const todo:{
//             index:number,
//             newCssText:string
//         }[]= [];
//         for (let index = 0; index < rules.length; index++) {
//           const rule = rules[index];
//           if(/:hover/.test(rule.selectorText)){
//             const newCssText = addHoverClass(rule.cssText)
//             console.log(newCssText)
//             todo.push({index,newCssText})
//           }
//         }
//         todo.forEach(({index,newCssText})=>{
//           styleSheet.deleteRule(index);
//           styleSheet.insertRule(newCssText,index);
//         })
//       }
// }

