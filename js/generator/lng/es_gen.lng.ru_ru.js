wa_gen.lng = {
	form: {
		main: {
			goToStart: "В начало",
			lng: {
				en: "English",
				ru: "Русский",
				ua: "Українська"
			},
			localizationIsNotAvailable: "Данная локализация сейчас недоступна",
			projectName: "Имя проекта",
			unNamedProject: "Без имени",
			fileSize: "Объём файла",
			byte: "байт",
			kilobyte: "КБ",
			megabyte: "МБ",
			icons: {
				rename: {
					tooltip: "Изменить имя проекта"
				},
				download_zip: {
					tooltip: "Скачать файл архивом"
				},
				download_file: {
					tooltip: "Скачать файл"
				}
			},
			msg: {
				renameProject: {
					title: "Изменение имени проекта",
					text: "Введите желаемое название проекта."
				},
                errorDownloadES: {
                    title: "Ошибка",
                    text: "При генерации файла внешнего источника произошла ошибка."
                }
			}
		},
		start: {
			aboutGenerator: "<b>ESGenerator</b> - удобный редактор для пользователей услугами сервиса WaspAce, который позволяет удобно и без ошибок редактировать файл настроек в формате JSON для его использования в качестве внешнего источника данных в сервисе WaspAce.",
			menuItems: {
				createNew: {
					title: "Создать новый",
					text: "Начните создание нового проекта с \"чистого листа\""
				},
				downloadFromUrl: {
					title: "Загрузить с url",
					text: "Укажите путь до файла в сети Internet, и данный файл будет загружен в редактор"
				},
				upload: {
					title: "Загрузить с файла",
					text: "Выберите файл в локальном файловом хранилище для его редактирования"
				}
			},
			msg: {
				uploadFromUrl: {
					title: "Загрука внешнего источника",
					text: "Введите url адрес файла внешнего источника.<br>Это может быть тестовый файл(.txt) или zip архив с текстовым файлом(.txt).",
					badUrl: "Неверный url файла внешнего источника",
					failedLoadFromUrl: "Загрузка внешнего источника из указанного url не удалась.",
					notValidJSON: "Файл внешнего источника не оказался валидным."
				},
				uploadFromPC: {
					title: "Загрука внешнего источника",
					text: "Выберите файл внешнего источника.<br>Это может быть тестовый файл(.txt) или zip архив с текстовым файлом(.txt).",
					failedLoadFromPC: "Загрузка внешнего источника из выбранного файла не удалась.",
					notValidJSON: "Файл внешнего источника не оказался валидным.",
					notSelectedFile: "Не выбран файл."
				},
				setNameProject: {
					title: "Новый проект",
					text: "Введите желаемое имя проекта."
				},
				usePrevES: {
					title: "Найден предыдущий внешний источник",
					text: "Найдена копия последнего используемого внешнего источника. Загрузить её?"
				},
				failedLoadFromBrowser: {
					title: "Ошибка",
					text: "Загрузка внешнего источника завершилась неуспешно."
				}
			}
		},
		badBrowser: {
			textTitle: "Устаревший браузер!",
			text: "Вы используете браузер, который не позволяет полноценно работать с веб-приложением WaspAce. Для нормальной работы рекомендуем использовать один из рекомендуемых браузеров, ссылки на которые приведены ниже:",
			items: {
				chrome: {
					text: "Chrome"
				},
				firefox: {
					text: "Firefox"
				},
				opera: {
					text: "Opera"
				},
				safari: {
					text: "Safari"
				}
			}
		},
		editor: {
			leftMenu: {
				setElemets: "Наборы элементов",
				exMasks: "Исключающие маски",
				adressReport: "Адрес отчетов"
			},
			form: {
				messageBox: {},
				setElements: {
					listOption: {
						priority: {
							text: "Приоритет",
							tooltip: ""
						},
						"delete": {
							text: "Удалить",
							tooltip: ""
						},
						add: {
							text: "Добавить",
							tooltip: ""
						}
					},
					listTable: {
						name: {
							text: "Имя элемента"
						},
						priority: {
							text: "Приоритет"
						},
						option: {
							text: "Опции",
							icons: {
								edit: {
									tooltip: "Переименовать"
								},
								priority: {
									tooltip: "Изменить приоритет"
								},
								"delete": {
									tooltip: "Удалить"
								}
							}
						}
					},
					unnamed: "Безымянный",
					msg: {
						add: {
							title: "Новый набор эллементов",
							text: "Введите имя нового набора"
						},
						rename: {
							title: "Переименование набора эллементов",
							text: "Введите новое имя набора"
						},
						setPriority: {
							title: "Изменение приоритета",
							text: "Введите желаемый приоритет эллемента.<br/>Это должно быть число от 0 до 999 999 999.",
							error: "Был неверенно введен приоритет эллемента.<br/>Число должно быть в промежутке от 0 до 999 999 999."
						},
						removeItem: {
							title: "Удаление эллемента",
							text: "Вы действительно хотите удалить эллемент?"
						},
						removeItems: {
							title: "Удаление эллементов",
							text: "Вы действительно хотите удалить выделенные эллементы?"
						}
					}
				},
				exMasks: {
					listOption: {
						"delete": {
							text: "Удалить",
							tooltip: ""
						},
						add: {
							text: "Добавить",
							tooltip: ""
						}
					},
					listTable: {
						name: {
							text: "Маска"
						},
						option: {
							text: "Опции",
							icons: {
								edit: {
									tooltip: "Изменить"
								},
								"delete": {
									tooltip: "Удалить"
								}
							}
						}
					},
					msg: {
						add: {
							title: "Новая исключающая маска",
							text: "Введите исключающую маску",
							error: "Вы не заполнили поле с маской."
						},
						edit: {
							title: "Изменение исключающей маски",
							text: "Введите желаемаю исключающую маску",
							error: "Вы не заполнили поле с маской."
						},
						removeItem: {
							title: "Удаление эллемента",
							text: "Вы действительно хотите удалить маску?"
						},
						removeItems: {
							title: "Удаление эллементов",
							text: "Вы действительно хотите удалить выделенные маски?"
						}
					}
				},
				report: {
					listOption: {
						"delete": {
							text: "Удалить",
							tooltip: ""
						},
						add: {
							text: "Добавить",
							tooltip: ""
						}
					},
					listTable: {
						name: {
							text: "Адресс"
						},
						option: {
							text: "Опции",
							icons: {
								edit: {
									tooltip: "Изменить"
								},
								"delete": {
									tooltip: "Удалить"
								}
							}
						}
					},
					msg: {
						canNotAdd: {
							title: "Ошибка",
							text: "Вы не можете добавить больше одного адреса отчета."
						},
						add: {
							title: "Новая URL отчетов",
							text: "Введите необходимый URL для отправки отчетов",
							error: "Вы не заполнили поле URL отчетов."
						},
						edit: {
							title: "Редактирование URL отчетов",
							text: "Введите необходимый URL для отправки отчетов",
							error: "Вы не заполнили поле URL отчетов."
						},
						removeItem: {
							title: "Удаление эллемента",
							text: "Вы действительно хотите удалить URL отчетов?"
						}
					}
				},
				element: {
					itemList: {
						pages: "Страницы",
						paths: "Пути",
						referers: "Рефереры",
						useragents: "Юзерагенты"
					},
					form: {
						pages: {
							listOption: {
								priority: {
									text: "Приоритет",
									tooltip: ""
								},
								"delete": {
									text: "Удалить",
									tooltip: ""
								},
								add: {
									text: "Добавить",
									tooltip: ""
								}
							},
							listTable: {
								name: {
									text: "Страница"
								},
								priority: {
									text: "Приоритет"
								},
								option: {
									text: "Опции",
									icons: {
										edit: {
											tooltip: "Изменить"
										},
										priority: {
											tooltip: "Изменить приоритет"
										},
										"delete": {
											tooltip: "Удалить"
										}
									}
								}
							},
							msg: {
								add: {
									title: "Добавление новых страниц",
									text: "Введите по одному адресу страницы на каждую строку.<br/>Пустые строки будут проигнорированны."
								},
								edit: {
									title: "Изменение страницы",
									text: "Введите новый адрес страницы."
								},
								setPriority: {
									title: "Изменение приоритета",
									text: "Введите желаемый приоритет страницы.<br/>Это должно быть число от 0 до 999 999 999.",
									error: "Был неверенно введен приоритет страницы.<br/>Число должно быть в промежутке от 0 до 999 999 999."
								},
								removeItem: {
									title: "Удаление страницы",
									text: "Вы действительно хотите удалить страницу?"
								},
								removeItems: {
									title: "Удаление страниц",
									text: "Вы действительно хотите удалить выделенные страницы?"
								}
							}
						},
						referers: {
							listOption: {
								priority: {
									text: "Приоритет",
									tooltip: ""
								},
								"delete": {
									text: "Удалить",
									tooltip: ""
								},
								add: {
									text: "Добавить",
									tooltip: ""
								}
							},
							listTable: {
								name: {
									text: "Реферер"
								},
								priority: {
									text: "Приоритет"
								},
								option: {
									text: "Опции",
									icons: {
										edit: {
											tooltip: "Изменить"
										},
										priority: {
											tooltip: "Изменить приоритет"
										},
										"delete": {
											tooltip: "Удалить"
										}
									}
								}
							},
							msg: {
								add: {
									title: "Добавление новых рефереров",
									text: "Введите по одному рефереру на каждую строку.<br/>Пустые строки будут проигнорированны."
								},
								edit: {
									title: "Изменение реферера",
									text: "Введите желаемый реферер."
								},
								setPriority: {
									title: "Изменение приоритета",
									text: "Введите желаемый приоритет реферера.<br/>Это должно быть число от 0 до 999 999 999.",
									error: "Был неверенно введен приоритет реферера.<br/>Число должно быть в промежутке от 0 до 999 999 999."
								},
								removeItem: {
									title: "Удаление реферера",
									text: "Вы действительно хотите удалить реферера?"
								},
								removeItems: {
									title: "Удаление рефереров",
									text: "Вы действительно хотите удалить выделенные рефереры?"
								}
							}
						},
						useragents: {
							listOption: {
								priority: {
									text: "Приоритет",
									tooltip: ""
								},
								"delete": {
									text: "Удалить",
									tooltip: ""
								},
								add: {
									text: "Добавить",
									tooltip: ""
								}
							},
							listTable: {
								name: {
									text: "Юзерагент"
								},
								priority: {
									text: "Приоритет"
								},
								option: {
									text: "Опции",
									icons: {
										edit: {
											tooltip: "Изменить"
										},
										priority: {
											tooltip: "Изменить приоритет"
										},
										"delete": {
											tooltip: "Удалить"
										}
									}
								}
							},
							msg: {
								add: {
									title: "Добавление новых юзерагентов",
									text: "Введите по одному юзерагенту на каждую строку.<br/>Пустые строки будут проигнорированны."
								},
								edit: {
									title: "Изменение юзерагента",
									text: "Введите новый юзерагент."
								},
								setPriority: {
									title: "Изменение приоритета",
									text: "Введите желаемый приоритет юзерагента.<br/>Это должно быть число от 0 до 999 999 999.",
									error: "Был неверенно введен приоритет юзерагента.<br/>Число должно быть в промежутке от 0 до 999 999 999."
								},
								removeItem: {
									title: "Удаление юзерагента",
									text: "Вы действительно хотите удалить юзерагент?"
								},
								removeItems: {
									title: "Удаление юзерагентов",
									text: "Вы действительно хотите удалить выделенные юзерагенты?"
								}
							}
						},
						paths: {
							listOption: {
								priority: {
									text: "Приоритет",
									tooltip: ""
								},
								"delete": {
									text: "Удалить",
									tooltip: ""
								},
								add: {
									text: "Добавить",
									tooltip: ""
								}
							},
							listTable: {
								name: {
									text: "Путь"
								},
								priority: {
									text: "Приоритет"
								},
								option: {
									text: "Опции",
									icons: {
										edit: {
											tooltip: "Переименовать"
										},
										priority: {
											tooltip: "Изменить приоритет"
										},
										"delete": {
											tooltip: "Удалить"
										}
									}
								}
							},
							unnamed: "Безымянный",
							msg: {
								add: {
									title: "Добавление нового пути",
									text: "Введите по одному элементу пути в каждую строку.<br/>Пустые строки будут проигнорированны."
								},
								edit: {
									title: "Изменение пути",
									text: "Введите по одному элементу пути в каждую строку.<br/>Пустые строки будут проигнорированны.",
									error: "Не введено ни одного эллемента пути."
								},
								rename: {
									title: "Изменение имени пути",
									text: "Введите новое имя пути."
								},
								setPriority: {
									title: "Изменение приоритета",
									text: "Введите желаемый приоритет путя.<br/>Это должно быть число от 0 до 999 999 999.",
									error: "Был неверенно введен приоритет путя.<br/>Число должно быть в промежутке от 0 до 999 999 999."
								},
								removeItem: {
									title: "Удаление путя",
									text: "Вы действительно хотите удалить путь?"
								},
								removeItems: {
									title: "Удаление путей",
									text: "Вы действительно хотите удалить выделенные пути?"
								}
							}
						}
					}
				}
			}
		},
		messageBox: {
			info: {
				buttons: {
					ok: {
						text: "ОК"
					}
				}
			},
			error: {
				buttons: {
					ok: {
						text: "ОК"
					}
				}
			},
			confirm: {
				buttons: {
					ok: {
						text: "ОК"
					},
					cancel: {
						text: "Отмена"
					}
				}
			},
			input: {
				buttons: {
					ok: {
						text: "ОК"
					},
					cancel: {
						text: "Отмена"
					}
				}
			},
			textarea: {
				buttons: {
					ok: {
						text: "ОК"
					},
					cancel: {
						text: "Отмена"
					}
				}
			},
			number: {
				buttons: {
					ok: {
						text: "ОК"
					},
					cancel: {
						text: "Отмена"
					}
				}
			},
			uploadFile: {
				buttons: {
					ok: {
						text: "Загрузить"
					},
					cancel: {
						text: "Отмена"
					}
				}
			}
		}
	},
	control: {
		itemInfo: {
			itemNoName: "Без имени",
			pages: "Страницы",
			paths: "Пути",
			referers: "Рефереры",
			useragents: "Юзерагенты"
		},
		selectFile:{
			selectFile: "Выбрать файл",
			notSelectedFile: "Файл не выбран",
			allFiles: "Все файлы"
		},
		navigation: {
			countPageView: {
				show: "Показывать:"
			},
			first: "«",
			last: "»",
			prev: "Назад",
			next: "Вперед",
			pages: "Страницы",
			goToPage: "Перейти к странице"
		}
	},
	other: {
		functionalityIsNotAvailable: "Данный функицонал сейчас недоступен"
	},
	title: {
		base: "Генератор внешнего источника данных - WaspAce Service"
	}
};