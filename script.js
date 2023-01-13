let brandList = []
let issuerList = []
let networkList = []
let productTypeList = []

let dataToUse = []

productCode.forEach(v => {
    Object.keys(v).forEach(key => {
        if (v[key] === null || v[key] === undefined) {
            delete v[key];
        }
    });

    dataToUse.push(v)
})


function screenScale() {
    function toUse() {
        const outsidecontainer = document.querySelector('.filter-card-container')
        const insideContainer = document.querySelector('.filter-card')
        const resultContainer = document.querySelector('.result-container')
        const resultCardContainer = document.querySelector('.result-card-container')
        const searchContainer = document.querySelector('.search-container')

        let widthToUse = insideContainer.offsetWidth
        let transformValue = outsidecontainer.offsetWidth / widthToUse
        let heightToUse = insideContainer.offsetHeight * transformValue

        if (outsidecontainer.offsetWidth < insideContainer.offsetWidth && outsidecontainer.offsetWidth > 768) {
            outsidecontainer.style.cssText = `transform: scale(${transformValue});
            transform-origin: top left;
            height: ${heightToUse}px; 
            `
        } else {
            outsidecontainer.style.cssText = ''
        }

        setTimeout(() => {
            if (window.screen.availWidth > 769) {
                if (resultCardContainer.offsetHeight > searchContainer.offsetHeight) {
                    resultContainer.style.cssText = `height: ${searchContainer.offsetHeight}px; overflow-y:scroll`
                } else {
                    resultContainer.style.cssText = `height: ${searchContainer.offsetHeight}px;`
                }
            } else {
                resultContainer.style.cssText = `min-height: 100px;`
            }
           
        },600)

   
    }

    toUse()
    window.addEventListener('resize', () => {
        toUse()
    })
}

function getUserChoices() {
    const selectedCategoryChoices = document.querySelectorAll('.selected-category')
    const selectedFilterChoices = document.querySelectorAll('.selected-filter')
    const showResultDom = document.querySelector('.result-card-container')

    userCategoryChoice = []
    userChoiceFilter = []

    filteredChoice = dataToUse

    selectedCategoryChoices.forEach(v => {
        let obj = {
            category: v.getAttribute('data-value'),
            value: 1
        }
        userCategoryChoice.push(obj)
    })


    selectedFilterChoices.forEach(v => {
        let obj = {
            filter: v.getAttribute('data-type'),
            value: v.getAttribute('data-value')
        }
        userChoiceFilter.push(obj)
    })

    // dataToUse.forEach(v => {
    //     userCategoryChoice.forEach(v2 => {
    //         if (v.hasOwnProperty(v2.category)) {
    //             filteredChoice.push(v)
    //         }
    //     })
    // })

    if (userCategoryChoice.length !== 0) {
        userCategoryChoice.forEach(v => {
            let result = filteredChoice.filter(v2 => {
                if (v2.hasOwnProperty(v.category)) {
                    return v2
                }
            })

            filteredChoice = result
        })
    }

    if (userChoiceFilter.length !== 0) {
        userChoiceFilter.forEach(v => {
            let result

            if (v.filter === 'brand') {
                result = filteredChoice.filter(v2 => {
                    if (v2.brand === v.value) {
                        return v2
                    }
                })
            }

            if (v.filter === 'issuer') {
                result = filteredChoice.filter(v2 => {
                    if (v2.issuer === v.value) {
                        return v2
                    }
                })
            }

            if (v.filter === 'network') {
                result = filteredChoice.filter(v2 => {
                    if (v2.network === v.value) {
                        return v2
                    }
                })
            }

            if (v.filter === 'productType') {
                result = filteredChoice.filter(v2 => {
                    if (v2.productType === v.value) {
                        return v2
                    }
                })
            }

            filteredChoice = result
        })

    }

    if (userCategoryChoice.length === 0 && userChoiceFilter.length === 0) {
        filteredChoice = []
    }

    showResultDom.innerHTML = ''

    filteredChoice.forEach(v => {
        showResultDom.innerHTML += `<div class="result-card">
        <div class="result-image-container">
          <div class="result-image-relative-container">
            <img src="https://sadanduseless.b-cdn.net/wp-content/uploads/2019/05/funny-corgi-butts2.jpg" alt="">
          </div>

          <div class="result-text-container">
            ${v.productName}
          </div>
        </div>
      </div> ` 
    })

    screenScale()

    // tempo.innerHTML = `<div class="margin: 50px 0">${JSON.stringify(userCategoryChoice)}</div>
    // <div class="margin: 50px 0">${JSON.stringify(userChoiceFilter)}</div>`
}

function categoryFunction() {
    let choice = document.querySelectorAll('.search-categories-choice')
    let container = document.querySelector('.search-categories-choice-container')
    let viewMore = document.querySelector('.category-view-more')

    let containerHeight = 0
    let containerMaxHeight = ''
    let containerTotalHeight = 0
    let maxHeightToUse = ''

    for (let i = 0; i < 3; i++) {
        containerHeight += choice[i].offsetHeight
    }

    choice.forEach(v => {
        containerMaxHeight = v.offsetHeight * 10
        containerTotalHeight += parseInt(v.offsetHeight)
        v.addEventListener('click', () => {
            if (!v.classList.contains('selected-category')) {
                v.classList.add('selected-category')
                getUserChoices()
            } else {
                v.classList.remove('selected-category')
                getUserChoices()
            }
        })
    })

    if (containerTotalHeight <= containerMaxHeight) {
        maxHeightToUse = `max-height: ${containerTotalHeight}px;`
    } else {
        maxHeightToUse = `max-height: ${containerMaxHeight}px; overflow-y:scroll`
    }

    container.style.cssText = `max-height: ${containerHeight}px`

    viewMore.addEventListener('click', () => {
        screenScale()
        if (viewMore.classList.contains('close')) {
            viewMore.classList.remove('close')
            container.style.cssText = maxHeightToUse
            viewMore.innerHTML = `Less <i class="fa fa-solid fa-chevron-up"></i>`
        } else {
            containerHeight = 0
            for (let i = 0; i < 3; i++) {
                containerHeight += choice[i].offsetHeight
            }

            let selected = document.querySelectorAll('.selected-category')

            selected.forEach(v => {
                container.insertBefore(v, container.children[0]);
            })

            container.scrollTo(0, 0)


            viewMore.classList.add('close')
            container.style.cssText = `max-height: ${containerHeight}px`
            viewMore.innerHTML = `More <i class="fa fa-solid fa-chevron-down"></i>`


        }

    })
}

function filterFunction(dom, type, numberToShow) {
    const filterContainer = dom.querySelector('.filter-search-container')
    const allChoices = dom.querySelectorAll('.filter-choice')
    const viewMoreButton = dom.querySelector('.filter-view-more')
    let containerHeight = 0
    let containerMaxHeight = ''
    let containerTotalHeight = 0
    let maxHeightToUse = ''

    for (let i = 0; i < numberToShow; i++) {
        containerHeight += allChoices[i].offsetHeight
    }



    allChoices.forEach(v => {
        containerMaxHeight = v.offsetHeight * 10
        containerTotalHeight += parseInt(v.offsetHeight)
        v.addEventListener('click', () => {
            let value = v.querySelector('.filter-text').getAttribute('data-value')
            if (!v.classList.contains('selected-filter')) {
                v.classList.add('selected-filter');

                v.setAttribute('data-type', type)
                v.setAttribute('data-value', value)

                getUserChoices()

            } else {
                v.classList.remove('selected-filter');
                v.classList.remove(type);
                v.removeAttribute('data-type')
                v.removeAttribute('data-value')

                getUserChoices()
            }
        })
    })

    if (containerTotalHeight <= containerMaxHeight) {
        maxHeightToUse = `max-height: ${containerTotalHeight}px;`
    } else {
        maxHeightToUse = `max-height: ${containerMaxHeight}px; overflow-y:scroll`
        viewMoreButton.style.cssText = 'display: block'
    }

    filterContainer.style.cssText = `max-height: ${containerHeight}px`

    viewMoreButton.addEventListener('click', () => {
        if (viewMoreButton.classList.contains('close')) {

            viewMoreButton.classList.remove('close')
            filterContainer.style.cssText = maxHeightToUse
            viewMoreButton.innerHTML = 'Less <i class="fa fa-solid fa-chevron-up"></i>'

        } else {
            containerHeight = 0
            for (let i = 0; i < numberToShow; i++) {
                containerHeight += allChoices[i].offsetHeight
            }

            let selected = dom.querySelectorAll('.selected-filter')

            selected.forEach(v => {
                filterContainer.insertBefore(v, filterContainer.children[0])
            })

            filterContainer.scrollTo(0, 0)

            viewMoreButton.classList.add('close')
            filterContainer.style.cssText = `max-height: ${containerHeight}px;`
            viewMoreButton.innerHTML = 'More <i class="fa fa-solid fa-chevron-down"></i>'
        }
    })
}

productCode.forEach(v => {
    if (v.brand !== null) {
        if (!brandList.includes(v.brand)) {
            brandList.push(v.brand)
        }
    }

    if (v.issuer !== null) {
        if (!issuerList.includes(v.issuer)) {
            issuerList.push(v.issuer)
        }
    }

    if (v.network !== null) {
        if (!networkList.includes(v.network)) {
            networkList.push(v.network)
        }
    }

    if (v.productType !== null) {
        if (!productTypeList.includes(v.productType)) {
            productTypeList.push(v.productType)
        }
    }
})

brandList.sort()
issuerList.sort()
networkList.sort()
productTypeList.sort()

function addFilterHTML(dom, data) {

    let container = dom.querySelector('.filter-search-container')

    data.forEach(v => {
        container.innerHTML +=
            `
            <div class="filter-choice">
                <div class="filter-box"></div>
                <div class="filter-text" data-value="${v}">${v}</div>
            </div>
            `
    })
}

categoryFunction()

const filterBrandDom = document.querySelector('.filter-brand')
const filterIssuerDom = document.querySelector('.filter-issuer')
const filterNetworkDom = document.querySelector('.filter-network')
const filterProductTypeDom = document.querySelector('.filter-productType')

addFilterHTML(filterBrandDom, brandList)
addFilterHTML(filterIssuerDom, issuerList)
addFilterHTML(filterNetworkDom, networkList)
addFilterHTML(filterProductTypeDom, productTypeList)
filterFunction(filterBrandDom, 'brand', 3)
filterFunction(filterIssuerDom, 'issuer', 3)
filterFunction(filterNetworkDom, 'network', 4)
filterFunction(filterProductTypeDom, 'productType', 3)

screenScale()

const filterViewMore = document.querySelectorAll('.filter-view-more')
const categoryViewMore = document.querySelector('.category-view-more')

filterViewMore.forEach(v => {
    v.addEventListener('click', () => {
        setTimeout(() => {
            screenScale()
        }, 600)
    })
})

categoryViewMore.addEventListener('click', () => {
    setTimeout(() => {
        screenScale()
    }, 600)
})
